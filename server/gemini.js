// AI enrichment: classify sentiment + one-line summary via Google Gemini.
// No key configured -> returns null so the app runs fine without AI. ponytail: graceful degrade.
import db from "./db.js";

const KEY = process.env.GEMINI_API_KEY;
// gemini-flash-latest tracks the current free-tier flash model (2.x names are deprecated for new keys).
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const PROMPT = (text) => `You analyze a customer testimonial. Reply with STRICT JSON only, no markdown:
{"sentiment":"positive|neutral|negative","summary":"<max 12 words>"}

Testimonial: """${text}"""`;

// Fallback when the LLM gives no usable sentiment: derive it from stars. 1-2 bad, 3 neutral, 4-5 good.
const byStars = (rating) => (rating <= 2 ? "negative" : rating === 3 ? "neutral" : "positive");

export async function enrich(id, text, rating) {
  let sentiment = null;
  let summary = null;

  if (KEY) {
    try {
      const res = await fetch(`${URL}?key=${KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: PROMPT(text) }] }],
          generationConfig: { temperature: 0, responseMimeType: "application/json" },
        }),
      });
      if (!res.ok) throw new Error(`Gemini ${res.status}`);
      const data = await res.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
      const parsed = JSON.parse(raw);
      if (["positive", "neutral", "negative"].includes(parsed.sentiment)) sentiment = parsed.sentiment;
      summary = parsed.summary?.slice(0, 200) ?? null;
    } catch (err) {
      console.warn(`[gemini] enrich failed for #${id}:`, err.message);
    }
  }

  // No key, failed call, or unusable response -> derive sentiment from the rating.
  if (!sentiment) sentiment = byStars(rating);

  db.prepare("UPDATE testimonials SET sentiment = ?, summary = ? WHERE id = ?").run(sentiment, summary, id);
}
