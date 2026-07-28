import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";
import { mkdirSync } from "node:fs";
import db from "./db.js";
import { enrich } from "./gemini.js";
import { widgetJs } from "./widget.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
// ponytail: Vercel's fs is read-only except /tmp (same constraint as db.js). Uploads there are
// ephemeral — lost between cold starts. Set UPLOAD_DIR to a mounted volume (e.g. on Render) to persist.
const UPLOADS =
  process.env.UPLOAD_DIR ||
  (process.env.VERCEL ? "/tmp/uploads" : join(__dirname, "uploads"));
mkdirSync(UPLOADS, { recursive: true });

const app = express();

// The dashboard frontend origin(s). Set FRONTEND_URL on the backend Vercel project
// (comma-separated for multiple). localhost is always allowed for dev.
const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
];
// Match preview deploys of the same project by its Vercel host prefix, derived from
// FRONTEND_URL (e.g. "saleshandy-assignment-sc8y"). If unset, allow any *.vercel.app.
let previewPrefix = null;
const firstFrontend = allowedOrigins.find((o) => o.endsWith(".vercel.app"));
try {
  if (firstFrontend) previewPrefix = new URL(firstFrontend).hostname.split(".")[0];
} catch {
  previewPrefix = null;
}

// Restrictive CORS for dashboard/submit/moderation (sends the app's own Origin).
const dashboardCors = cors({
  origin(origin, callback) {
    // Allow requests without an Origin (Postman, server-to-server, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (
      origin.endsWith(".vercel.app") &&
      (!previewPrefix || origin.includes(previewPrefix))
    ) {
      return callback(null, true);
    }
    console.log("Blocked CORS Origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
});

// ponytail: public read + widget must load from strangers' sites, so they get OPEN CORS
// (any origin, no credentials). Everything else gets the restrictive allowlist above.
// One dispatcher so only ONE cors runs per request (a global dashboardCors after an open
// one would re-reject stranger origins on the public route).
const openCors = cors();
app.use((req, res, next) => {
  const open =
    req.path === "/widget.js" || req.path.startsWith("/api/testimonials/public");
  return (open ? openCors : dashboardCors)(req, res, next);
});
app.use(express.json());
app.use("/uploads", express.static(UPLOADS));

// --- photo upload (optional, images only, 3MB) ---
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS,
    filename: (_req, file, cb) =>
      cb(
        null,
        `${Date.now()}-${Math.round(Math.random() * 1e6)}${extname(file.originalname)}`,
      ),
  }),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const toPage = (v, def) => Math.max(1, parseInt(v, 10) || def);
const publicUrl = (req, p) =>
  p ? `${req.protocol}://${req.get("host")}${p}` : null;

const shape = (req) => (row) => ({
  ...row,
  photo_url: publicUrl(req, row.photo_path),
  photo_path: undefined,
});

// --- POST /api/testimonials : public submit ---
app.post("/api/testimonials", upload.single("photo"), (req, res) => {
  const { name, email, company, text, rating } = req.body;
  const r = parseInt(rating, 10);

  if (!name?.trim() || !email?.trim() || !text?.trim())
    return res
      .status(400)
      .json({ error: "Name, email, and testimonial are required." });
  if (!isEmail(email))
    return res.status(400).json({ error: "Please enter a valid email." });
  if (!(r >= 1 && r <= 5))
    return res.status(400).json({ error: "Rating must be between 1 and 5." });
  if (text.trim().length < 10)
    return res
      .status(400)
      .json({ error: "Testimonial must be at least 10 characters." });

  // dedup: same person, same words already submitted
  const dup = db
    .prepare("SELECT id FROM testimonials WHERE email = ? AND text = ?")
    .get(email.trim(), text.trim());
  if (dup)
    return res
      .status(409)
      .json({ error: "You've already submitted this testimonial." });

  const photo_path = req.file ? `/uploads/${req.file.filename}` : null;
  const info = db
    .prepare(
      `INSERT INTO testimonials (name, email, company, text, rating, photo_path)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(
      name.trim(),
      email.trim(),
      company?.trim() || null,
      text.trim(),
      r,
      photo_path,
    );

  enrich(info.lastInsertRowid, text.trim(), r); // fire-and-forget AI enrichment (falls back to star-based sentiment)
  res.status(201).json({ id: info.lastInsertRowid });
});

// --- GET /api/testimonials : dashboard list (optionally by status) ---
app.get("/api/testimonials", (req, res) => {
  const { status } = req.query;
  const page = toPage(req.query.page, 1);
  const limit = Math.min(50, toPage(req.query.limit, 20));
  const where = ["pending", "approved", "rejected"].includes(status)
    ? "WHERE status = ?"
    : "";
  const params = where ? [status] : [];

  const total = db
    .prepare(`SELECT COUNT(*) n FROM testimonials ${where}`)
    .get(...params).n;
  const rows = db
    .prepare(
      `SELECT * FROM testimonials ${where} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
    )
    .all(...params, limit, (page - 1) * limit);

  res.json({ items: rows.map(shape(req)), total, page, limit });
});

// --- GET /api/testimonials/public : approved only (wall + widget) ---
app.get("/api/testimonials/public", (req, res) => {
  const page = toPage(req.query.page, 1);
  const limit = Math.min(50, toPage(req.query.limit, 12));
  const total = db
    .prepare("SELECT COUNT(*) n FROM testimonials WHERE status='approved'")
    .get().n;
  const rows = db
    .prepare(
      "SELECT id,name,company,text,rating,photo_path,created_at FROM testimonials WHERE status='approved' ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?",
    )
    .all(limit, (page - 1) * limit);
  res.json({ items: rows.map(shape(req)), total, page, limit });
});

// --- PATCH /api/testimonials/:id : approve / reject ---
app.patch("/api/testimonials/:id", (req, res) => {
  const { status } = req.body;
  if (!["approved", "rejected", "pending"].includes(status))
    return res.status(400).json({ error: "Invalid status." });
  const info = db
    .prepare("UPDATE testimonials SET status = ? WHERE id = ?")
    .run(status, req.params.id);
  if (!info.changes) return res.status(404).json({ error: "Not found." });
  res.json({ id: Number(req.params.id), status });
});

// --- GET /widget.js : embeddable script for third-party sites ---
app.get("/widget.js", (_req, res) => {
  res.type("application/javascript").send(widgetJs);
});

// On Vercel this runs as a serverless function (see server/vercel.json) — it exports `app`
// as the handler and never calls listen(). Everywhere else, run a normal HTTP server.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
}

export default app;
