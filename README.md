# ADJ — intro page

Landing page for [github.com/ADJ189](https://github.com/ADJ189). Astro + Tailwind v4, with React
islands for the one interactive piece: click a project preview and it plays a small
click → ripple → redirect animation before opening the real thing.

No local dev environment needed to work on this — same as every other repo here, it's built entirely
through GitHub's web editor. Clone it if you want, but you don't have to.

## Stack

| | |
|---|---|
| Framework | [Astro](https://astro.build) (static output) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite` |
| Interactive islands | React 19, mounted with `client:visible` |
| Animation | [anime.js](https://animejs.com) |
| Fonts | Bricolage Grotesque (display), Inter (body), JetBrains Mono (labels) — self-hosted via `@fontsource` |
| Lint | ESLint 9 flat config — `eslint-plugin-astro`, `typescript-eslint`, `eslint-plugin-react` / `react-hooks`, `eslint-plugin-jsx-a11y` |
| Perf/a11y budget | Lighthouse CI |
| Deploy | Cloudflare Pages, static `dist/` output |

## Commands

```bash
npm install
npm run dev        # local dev server
npm run typecheck  # astro check — 0 errors required
npm run lint        # eslint . — 0 errors required
npm run lint:fix    # auto-fix what's fixable
npm run build       # -> dist/
npm run preview     # serve the built dist/ locally
```

All four (typecheck, lint, build, and a Lighthouse pass) run in CI on every push and PR — see
`.github/workflows/`.

## Deploy

Push to GitHub, connect the repo in Cloudflare Pages:

- **Build command:** `npm run build`
- **Output directory:** `dist`

No adapter needed — this is `output: 'static'`, so Pages just serves the `dist/` folder directly.

## Project structure

```
src/
  layouts/Layout.astro        base HTML shell, fonts, global styles
  components/
    Nav.astro                 sticky header
    Hero.astro                headline + "how I build" strip
    ProjectCard.astro         card shell: badges, repo/live links
    ProjectPreview.tsx        the interactive piece (see below)
    Footer.astro
  pages/index.astro           assembles the page, holds the project data
  styles/global.css           design tokens
```

### `ProjectPreview.tsx`

Each project's preview tile is a small faithful recreation of that product's *real* interface —
not a generic mockup — built from ADJ's actual screenshots (CompressZ, Session Clock, Cinematch).
Colors, gradient, and type all come from what those apps actually look like.

Clicking a tile:

1. Drops a cursor + ripple element at the click point, animated with anime.js.
2. Fades the card slightly.
3. Navigates to `href` once the animation completes.

Cmd/Ctrl/Shift-click or middle-click skips all of that and lets the browser handle it — the
element is a real `<a href>` under the hood, so opening in a new tab, screen readers, and keyboard
navigation all work normally. The decorative preview markup is `aria-hidden`; the actual accessible
name comes from a visually-hidden label so assistive tech announces "Open CompressZ in a new tab"
rather than reading out the mock UI's copy.

## Quality gates

- **`.github/workflows/ci.yml`** — `astro check`, `eslint .`, `astro build` on every push/PR. All three must exit clean.
- **`.github/workflows/lighthouse.yml`** — builds `dist/` and runs Lighthouse CI against it (`lighthouserc.json`). Accessibility must score ≥ 0.90 or the check fails; performance, best-practices, and SEO warn below 0.85–0.90 but don't block.
- **`.github/dependabot.yml`** — weekly PRs for npm and GitHub Actions dependencies, with minor/patch npm bumps grouped into one PR instead of one-per-package.

Last local run before shipping: typecheck 0 errors, lint 0 errors, Lighthouse 100 / 91–100 / 100 / 100
(accessibility / performance / best-practices / SEO, 3-run median).

## Known gaps

- **CompressZ** and **Cinematch** cards link to their GitHub repos rather than a live URL — I don't
  have confirmed Pages URLs for those on file. Session Clock already points at
  `accurate-time.pages.dev`. Send the other two over and I'll wire them in.
- Preview tiles are hand-recreated from screenshots, not live embeds or real screenshots — swap in
  actual images if you'd rather have those.
