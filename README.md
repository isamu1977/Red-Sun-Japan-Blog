# Red Sun Japan — Official Editorial Web Portal

The official digital archive and editorial extension of the **Red Sun Japan** YouTube channel.
Long-form, citation-grade chronicles of feudal Japan — samurai warfare, Yokai folklore, and Kaidan (怪談) translated and contextualized from regional Japanese archives into English.

> Visual direction: *Cinematic Dark Fantasy Digital Painting* — charcoal stone, lantern amber highlights, samurai crimson accents. The UI deliberately reads as a printed historical manuscript rendered for the web.

---

## 1. Overview & Concept

**Red Sun Japan** began as a YouTube documentary channel exploring the darker corners of Japanese history. This portal is its editorial companion: every video is paired with a written chronicle — longer, sourced, and structured for citation.

**Editorial focus**

- **Feudal chronicles** — Sengoku, Muromachi, and Edo-period power struggles.
- **Samurai warfare** — strategy, equipment, code of honor, and the lives of retainers.
- **Dark folklore** — Yokai (妖怪), Yurei (幽霊), and Kaidan (怪談) with their regional origins.
- **Translation discipline** — Japanese terminology is preserved in romaji with selective kanji on first appearance (*hamon*, *nakago*, *seppuku*, *ronin*, *bakufu*) and italicized in body copy.

**Voice & tone**

- Documentary, not listicle.
- Historical specificity over headline-friendly myth.
- Primary-source attribution where possible; folklore labeled as folklore.

**Visual language**

A grounded "cinematic dark fantasy" treatment — the page should feel like a dimly lit stone archive illuminated by a paper lantern. Imagery is restrained; typography does the heavy lifting.

---

## 2. Technical Stack

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | [Astro 7](https://astro.build) | Static Site Generation (SSG), zero JS by default, islands only where needed. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | CSS-first config, native dark/light design tokens. |
| **Search** | [Pagefind](https://pagefind.app) | Client-side static search built at compile time. |
| **Content Collections** | Astro + Zod / TypeScript | Strict frontmatter schema (`src/content.config.ts`). |
| **Typography** | Google Fonts via Astro `fonts` API | `Cinzel` (display serif) + `Google Sans Code` (mono/metadata). |
| **Markdown pipeline** | remark-toc, remark-collapse, rehype-callouts, Shiki (`min-light` / `night-owl`) | Collapsible TOC, admonitions, dual-theme syntax highlighting. |
| **Dynamic OG images** | `satori` + `sharp` | Per-post Open Graph generation (`src/pages/og.png.ts`). |
| **Privacy / Compliance** | In-house zero-dependency cookie consent | GDPR, CCPA/CPRA, LGPD, APPI compliant. |
| **Deployment** | Coolify (self-hosted PaaS) | Git-triggered builds via the included `Dockerfile`; production runtime is `nginx:mainline-alpine-slim` serving `dist/`. |

### Runtime requirements

- **Node.js** `>= 22.12.0` (enforced in `package.json`).
- **Package manager** `pnpm@10.32.1` (pinned via the `packageManager` field).

### Getting started

```bash
# Install dependencies (frozen lockfile)
pnpm install --frozen-lockfile

# Start the dev server (background, per project AGENTS.md)
astro dev --background

# Verify production build + type-check + index search
pnpm run build

# Preview the built site locally
pnpm run preview

# Format & lint
pnpm run format
pnpm run lint
```

### Available scripts (`package.json`)

| Script | Purpose |
|---|---|
| `pnpm run dev` | Astro dev server with HMR. |
| `pnpm run build` | `astro check` → `astro build` → Pagefind index → copy index into `public/`. |
| `pnpm run preview` | Serve the built `dist/` locally. |
| `pnpm run sync` | Regenerate Astro content-collection types. |
| `pnpm run format` / `format:check` | Prettier (`prettier-plugin-astro`, `prettier-plugin-tailwindcss`). |
| `pnpm run lint` | ESLint with `eslint-plugin-astro`. |

### Project structure

```
redsunjapan-blog/
├── astro.config.ts          # Integrations, fonts, markdown pipeline, env schema
├── astro-paper.config.ts    # Site, posts, features, socials, share links
├── src/
│   ├── components/          # 14 Astro components (Card, Header, Footer, YouTube*, CookieConsent, …)
│   ├── content/
│   │   ├── blog/            # Markdown / MDX posts (loader: glob "**/[^_]*.{md,mdx}")
│   │   └── pages/           # Static pages (about, privacy)
│   ├── content.config.ts    # Zod schemas for `posts` and `pages`
│   ├── layouts/Layout.astro
│   ├── pages/               # Routes: index, archives, posts, tags, search, og.png.ts, rss.xml.ts
│   ├── styles/              # base.css · global.css · theme.css · typography.css
│   └── utils/               # getSortedPosts · getReadingTime · getUniqueTags · slugify · withBase
├── public/
│   ├── assets/              # Logo PNGs (4 variants)
│   ├── pagefind/            # Auto-generated at build time
│   ├── default-og.jpg
│   ├── favicon.png / favicon.svg
├── Dockerfile               # Multi-stage: pnpm build → nginx static serve
├── compose.yaml             # Dev container with hot-reload
└── .github/                 # Workflows
```

---

## 3. Key Architectural Features

### Editorial layout

- **Split 60/40 Hero Showcase** on the homepage — editorial hero on the left, a pinned conversion card on the right.
- **Interactive category pills** backed by the `tags` collection (`src/pages/tags/[tag]/[...page].astro`).
- **3-column responsive card grid** with breakpoints tuned for tablet and mobile reading (`src/components/Card.astro`).
- **Pagination** at `src/pages/posts/[...page].astro` using `astro-paper.config.ts → posts.perPage`.

### Dual-mode theme fidelity

The default theme is the charcoal **dark** mode (paper-on-stone). The light theme is intentionally a warm *pressed-washi ivory* — not pure white — to preserve the manuscript feel. Both themes are first-class and tested for contrast in `src/styles/theme.css` and `src/styles/base.css`. Tokens are wired through Tailwind v4's native `@theme` directive.

### Privacy & compliance (zero third-party scripts)

- **In-house cookie consent** — `src/components/CookieConsent.astro` exposes a `localStorage`-backed preference registry (`rsj_cookie_consent`) with granular toggles per category (essential, analytics, embedded media).
- **Footer preference recall** — choices survive reloads and are surfaced again on policy updates.
- **Privacy-first YouTube embeds** — `src/components/YouTubeEmbed.astro` always renders `youtube-nocookie.com` until consent is granted; a click-to-load fallback handles the gate. `YouTubeCard.astro` provides the textual alternative for non-consenting users.
- **Dedicated privacy page** at `/privacy` (`src/pages/privacy.astro`) covering GDPR, CCPA/CPRA, LGPD, and APPI disclosure.

### Ecosystem integration

- Channel conversion cards link directly to `@redsunjapan` on YouTube.
- `Socials.astro` exposes configured links from `astro-paper.config.ts → socials[]` — currently `youtube` and `rss`.
- Share intent URLs are pre-wired for WhatsApp, Facebook, X, Telegram, Pinterest, and email (`astro-paper.config.ts → shareLinks[]`).
- `rss.xml.ts` and `sitemap` integration keep feeds current at build time.

### Editorial ergonomics

- **`getReadingTime.ts`** — displayed alongside the byline on every post.
- **Collapsible TOC** via `remark-collapse` + `remark-toc`, scoped to the `Table of contents` heading only.
- **Rehype callouts** for editorial notes (`> [!NOTE]`, `> [!WARNING]`, …).
- **Dynamic OG images** generated per post at build time (`src/pages/og.png.ts`) using `satori` for SVG layout and `sharp` for rasterization.
- **Code highlighting** via Shiki with two themes (`min-light` for light mode, `night-owl` for dark mode) and Shiki transformers for diff, highlight, and word-level highlight notations.

---

## 4. Content Creation Schema (Frontmatter)

Markdown and MDX files live in `src/content/blog/[slug].md` (or `.mdx`). The collection is defined in `src/content.config.ts` and validates every frontmatter field against the Zod schema below.

**Required frontmatter**

```yaml
---
title: "The Cursed Swords of Muramasa"
pubDatetime: 2026-09-17T00:00:00Z
description: "Chronicles of the lethal blades that haunted feudal Japan."
heroImage: "/images/muramasa-cover.jpg" # 16:9 aspect ratio
tags:
  - samurai
  - folklore
  - katana
featured: true
draft: false
---
```

**Full schema reference** (from `src/content.config.ts`):

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `title` | `string` | yes | — | Headline of the chronicle. |
| `pubDatetime` | `Date` | yes | — | ISO 8601. Renders in `Asia/Tokyo` site timezone. |
| `description` | `string` | yes | — | Used for meta description and card excerpt. |
| `author` | `string` | no | `config.site.author` (`"Red Sun Japan"`) | Override per post if needed. |
| `modDatetime` | `Date` | no | — | Surfaces an "Updated" badge. |
| `tags` | `string[]` | no | `["others"]` | Powers `/tags/[tag]` routes. |
| `featured` | `boolean` | no | — | Promotes the post in the Hero Showcase. |
| `draft` | `boolean` | no | — | Drafts are excluded from production builds. |
| `heroImage` | `string \| image()` | no | — | Hero asset. Prefer 16:9; place under `public/`. |
| `ogImage` | `string \| image()` | no | auto-generated | Per-post Open Graph; auto-generated if omitted. |
| `canonicalURL` | `string` | no | — | Set when republishing syndicated content. |
| `hideEditPost` | `boolean` | no | — | Hides the "Edit on GitHub" affordance. |
| `timezone` | `string` | no | — | Per-post override of `Asia/Tokyo`. |

**Conventions**

- Filenames are kebab-case slugs (e.g. `cursed-swords-of-muramasa.md`).
- Files prefixed with `_` (e.g. `_drafts/`) are excluded by the glob loader.
- Japanese terminology in body copy should be italicized on first use (*hamon*, *seppuku*, *ronin*).
- Hero images should be 16:9 and live under `public/` (or another folder served as static asset).
