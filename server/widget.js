// Served at GET /widget.js. A dependency-free IIFE a third-party site drops in via:
//   <div id="testimonials"></div>
//   <script src="http://localhost:4000/widget.js"
//           data-target="testimonials" data-accent="#275DF5" data-limit="6"></script>
// It infers the API origin from its own src, so it works wherever the server is hosted.
export const widgetJs = `(function () {
  var s = document.currentScript;
  var origin = new URL(s.src).origin;
  var targetId = s.getAttribute("data-target") || "testimonials";
  var accent = s.getAttribute("data-accent") || "#275DF5";
  var limit = parseInt(s.getAttribute("data-limit"), 10) || 6;
  var mount = document.getElementById(targetId);
  if (!mount) return;

  var esc = function (x) {
    return String(x == null ? "" : x).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var stars = function (n) {
    var out = "";
    for (var i = 1; i <= 5; i++)
      out += '<span style="color:' + (i <= n ? "#F59E0B" : "#E5E7EB") + '">\\u2605</span>';
    return out;
  };

  var style = document.createElement("style");
  style.textContent =
    ".thw{font-family:Inter,system-ui,-apple-system,sans-serif;display:grid;gap:16px;" +
    "grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}" +
    ".thw-card{border:1px solid #EEE;border-radius:14px;padding:16px;background:#fff;" +
    "box-shadow:0 1px 2px rgba(0,0,0,.04)}" +
    ".thw-stars{font-size:15px;letter-spacing:1px;margin-bottom:8px}" +
    ".thw-text{color:#0B0B0B;font-size:14px;line-height:20px;margin:0 0 12px}" +
    ".thw-who{display:flex;align-items:center;gap:10px}" +
    ".thw-av{width:36px;height:36px;border-radius:9999px;object-fit:cover;background:" + accent + "22;" +
    "display:flex;align-items:center;justify-content:center;color:" + accent + ";font-weight:700;font-size:14px}" +
    ".thw-name{font-size:13px;font-weight:600;color:#0B0B0B}" +
    ".thw-co{font-size:12px;color:#6B7280}" +
    ".thw-empty{color:#6B7280;font-size:14px}";
  document.head.appendChild(style);

  fetch(origin + "/api/testimonials/public?limit=" + limit)
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var items = (d && d.items) || [];
      if (!items?.length) { mount.innerHTML = '<p class="thw-empty">No testimonials yet.</p>'; return; }
      var wrap = document.createElement("div");
      wrap.className = "thw";
      wrap.innerHTML = items.map(function (t) {
        var av = t.photo_url
          ? '<img class="thw-av" src="' + esc(t.photo_url) + '" alt="">'
          : '<span class="thw-av">' + esc((t.name || "?").charAt(0).toUpperCase()) + "</span>";
        return '<div class="thw-card"><div class="thw-stars">' + stars(t.rating) + "</div>" +
          '<p class="thw-text">' + esc(t.text) + "</p>" +
          '<div class="thw-who">' + av + "<div><div class=\\"thw-name\\">" + esc(t.name) +
          "</div><div class=\\"thw-co\\">" + esc(t.company || "") + "</div></div></div></div>";
      }).join("");
      mount.innerHTML = "";
      mount.appendChild(wrap);
    })
    .catch(function () { mount.innerHTML = '<p class="thw-empty">Could not load testimonials.</p>'; });
})();`;
