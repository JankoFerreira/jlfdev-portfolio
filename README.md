# Janko Ferreira portfolio

React and TypeScript source lives in `app/src`, with original styles in `app/css`.

Run `npm ci` then `npm run dev`. Run `npm run build` to type-check and build. The build stages `index.html` and `assets/` at the repository root for GitHub Pages; commit those generated files together with source changes.

Run `node scripts/check-portfolio.mjs` to check original feature markup, links, images, content and motion rules.

The original animated mesh, pointer-revealed code rain, typing headline, word entrance, project frames, logo strip and Tech Globe are retained. Code rain is capped at 20 draws per second, runs only when revealed, and pauses during scrolling or when the tab is hidden. The globe rotates while visible, with drag and keyboard controls. Off-screen decorative animations pause. Reduced-motion preferences are respected.
