# JOURNAL.md — Decision Journal

## 1. Prioritization

**Build order:** P0 core loop first, end to end, before anything else — (1) backend API + SQLite,
(2) submission form, (3) moderation dashboard, (4) public wall. Only once submit → pending →
approve → wall worked did I move to P1 (embeddable widget, pagination, dedup, states) and then
P2 (one AI feature).

**Why this order:** the brief says the core loop is tested first and is the minimum bar. A widget
with nothing to show is worthless, so the data path had to exist and be verified before polish.

**Deliberately cut / skipped:**
- Auth, payments, multi-business, roles, email — explicit non-goals in the brief.
- Live deploy — chose to spend the time on product quality instead; deploy path is documented in the README.
- A full test framework — I verified with curl against the real API and by clicking the flow, not with a suite (see §4).

## 2. Key decisions

- **Decision:** Database = SQLite (better-sqlite3).
  **Options:** SQLite, Neon/Supabase Postgres, Mongo Atlas.
  **Why:** one business, one table, no concurrency worries. Zero config, no cloud account, synchronous
  API = simplest possible code. Trades easy serverless deploy for local simplicity — the right call for a take-home.

- **Decision:** Widget is a **served `<script>`** (`GET /widget.js`), not an iframe.
  **Options:** iframe embed, script tag, JSON + copy-paste HTML.
  **Why:** a script that renders into the host page inherits nothing awkward from an iframe (sizing,
  scroll), lets the host pass `data-accent`/`data-limit`, and it infers its own API origin from `script.src`
  so it works wherever the server is hosted. It's dependency-free and escapes all user text (XSS).

- **Decision:** Rejected testimonials are filtered **at the query** in a separate public endpoint.
  **Options:** filter server-side vs filter in the client.
  **Why:** the public endpoint only ever runs `WHERE status='approved'`. There is no code path that can
  leak a pending/rejected row to the wall or widget — the safety is structural, not a client checkbox.

- **Decision:** AI feature = Gemini sentiment + one-line summary, fired **async after insert**, degrades to no-op without a key.
  **Options:** OpenRouter free models, Groq, Gemini; sync vs async.
  **Why:** Gemini's free tier has a generous quota and a simple REST call. Running it after the row is
  saved means a slow/failed AI call never blocks or fails a customer's submission. No key → app still works.

- **Decision (brief was silent):** substitute **Inter** for the design's **Matter** font.
  **Why:** Matter is a commercial font not freely distributable. Inter is the closest free geometric sans and keeps the intended voice.

- **Decision (brief was silent):** duplicate handling = reject exact `email`+`text` repeats with HTTP 409.
  **Why:** cheapest meaningful junk/dup guard; catches accidental double-submits without over-engineering fuzzy matching.

## 3. Working with AI agents

- **Tools and models:** Claude Code (this session), model Claude Opus 4.8. Used for essentially all
  the code, driven by me deciding architecture, stack constraints, and priorities.
- **How I split the work:** I set the plan (stack, DB, widget approach, build order) and the agent
  implemented each slice; I verified each slice by running it before moving on. I made the agent
  reverse-engineer the HeroUI v3 API from the actual installed package rather than trust its memory.
- **Agent setup:** `CLAUDE.md` at the repo root — it pins the stack, the "rejected never leaks" rule,
  the no-auth non-goal, and HeroUI v3's compound-component conventions, so the agent doesn't drift back
  to defaults (e.g. Tailwind v3 config files or a Provider wrapper HeroUI v3 doesn't use).
- **Most important prompts / steering:**
  - "For any third-party thing ask me for the API key, pick what's feasible" → led to the Gemini + SQLite
    choices being confirmed up front instead of assumed.
  - Forcing verification of HeroUI's real peer deps (`npm view`) — this caught that HeroUI v3 needs
    Tailwind **v4** + React **19**, which changes the entire frontend setup (no `tailwind.config.js`).
- **A time AI was wrong (twice):**
  (1) The first `better-sqlite3` version (`^11.8.1`) resolved to a build with no prebuilt binary for
  Node 24, so `npm install` failed on `node-gyp`. I noticed from the gyp error, checked
  `npm view better-sqlite3 versions`, and bumped to `^12.9.0` which ships Node 24 prebuilds.
  (2) The HeroUI v3 setup pulled from its `llms.txt` (`@import "tailwindcss"; @plugin "@heroui/react";`)
  crashed the Tailwind build ("k is not a function"). I inspected the actual installed `@heroui/styles`
  package and found the real v3 entry is a single `@import "@heroui/styles"`. Fixed and the build passed.
  (3) The Gemini model in the code (`gemini-2.0-flash`) returned 404 "no longer available to new users"
  for this key; I listed the key's models and switched to `gemini-flash-latest`, which returns valid
  completions via curl.
- **Something rejected:** the `@plugin`-based Tailwind config from HeroUI's own docs — thrown away in
  favor of what the installed package actually exports. Lesson: verify against the installed code, not the docs.

## 4. Verification

- **Backend:** started the server and drove every endpoint with curl — submit (201), duplicate (409),
  invalid rating (400), list by status, approve (PATCH), public endpoint returns only approved, and
  `/widget.js` serves. All confirmed before building any UI.
- **Frontend / full flow:** headless-rendered every page with Chrome (`--dump-dom`): the Submit form,
  the Wall (shows approved #1, and confirmed rejected #2's text is absent), and the Dashboard (Approve/Reject
  buttons present). Submitted a testimonial through the Vite dev proxy (`POST /api/…` on :5173) and confirmed
  it appears as pending — the exact submit → pending → approve → wall path the brief tests.
- **Widget:** headless-loaded `embed-demo.html` (served from :5173) which pulls `widget.js` from :4000 and
  fetches the API cross-origin — the approved testimonial rendered into the third-party page, and rejected #2
  did not. Also ran `node --check` on the served `widget.js` to confirm it's valid JS.
- **AI enrichment:** verified the model + key work via curl (`gemini-flash-latest` returns completions), and
  unit-tested the parse→store logic offline. The live in-app call fails **only on this machine** because a
  corporate TLS-intercepting proxy makes Node's `fetch` reject the cert (`unable to get local issuer
  certificate`); curl to the same URL succeeds. It will work on a normal network / deployed host.
- **Known fragile:** single SQLite file (no migrations tooling); AI enrichment is best-effort (no retry);
  no rate limiting on the public submit endpoint; the TLS-proxy issue above is environment-specific.

## 5. If I had 5 more hours
1. Live deploy (frontend on Vercel, backend + volume on Fly.io) so it's clickable.
2. Rate-limit + lightweight spam scoring on the public submit endpoint.
3. Widget layout options (grid vs carousel) beyond the accent-color knob.
4. A couple of real tests around the moderation state machine and the "rejected never leaks" guarantee.
