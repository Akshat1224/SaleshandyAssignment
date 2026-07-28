# CLAUDE.md — Agent instructions for this repo

This file steers coding agents (Claude Code) working on the testimonial platform.

## What this project is
A small testimonial platform: customers submit testimonials → the business owner
moderates them in a dashboard → approved ones appear on a public wall and an
embeddable widget for third-party sites. Built as a take-home assignment.

## Stack (do not swap without asking)
- **Frontend:** React 19 + Vite, TailwindCSS **v4** (CSS-first, no `tailwind.config.js`),
  **HeroUI v3** components, Heroicons. Router: react-router-dom v7.
- **Backend:** Node + Express, **better-sqlite3** (synchronous, single file `data.db`), multer for photos.
- **AI:** Google Gemini (`gemini-2.0-flash`) for sentiment + summary — optional, degrades gracefully.

## Hard rules
- **One business, one owner. No auth** — the dashboard is intentionally unprotected (assignment non-goal).
- **Rejected testimonials must never reach the public wall or widget.** The public API filters `status='approved'` at the query. Never widen it.
- Tailwind v4 tokens live in `web/src/theme.css` under `@theme`. Reuse those tokens everywhere (wall + widget included) so the brand reads as one system.
- HeroUI v3 uses **compound components** (`Card`, `TextField` + `Label` + `Input`, `Tabs.Item`) and React-Aria props (`onPress`, `onChange` receiving values). No `<Provider>` wrapper needed.
- Keep the widget (`server/widget.js`) **dependency-free** — it runs on strangers' sites.

## Conventions
- ES modules everywhere (`"type": "module"`).
- Server validates every public input at the boundary; escape user text in the widget (XSS).
- Small, honest commits: `SALESHANDY: Assignment | <description>`.

## Run
`npm run install:all` then `npm run dev` (server :4000, web :5173, Vite proxies `/api`).
