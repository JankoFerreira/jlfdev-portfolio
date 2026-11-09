# Janko Ferreira portfolio

React and TypeScript source lives in `app/src`, with the original visual styles in `app/css`.

Run `npm ci` then `npm run dev` for local development. Run `npm run build` to type-check and create the production build. The build stages `index.html` and `assets/` at the repository root for GitHub Pages. Commit these generated files together with source changes.

The preparation script copies the existing `media/` and `images/` assets to the ignored `app/public/` directory. The Tech Globe renders on interaction and resize; it has no continuous idle animation. The background is static, and all page content remains visible without scroll-triggered animation.
