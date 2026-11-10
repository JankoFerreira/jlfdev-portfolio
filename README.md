# Janko Ferreira portfolio

React and TypeScript source lives in `app/src`, with original styles in `app/css`.

Run `npm ci` then `npm run dev`. Run `npm run build` to type-check and build. Generated `index.html` and `assets/` are staged at the root for GitHub Pages. Commit those files with source changes.

Checks: `node scripts/check-portfolio.mjs` and `node scripts/check-paint.mjs`.

The original layout, typing headline, entrance effects, project frames, logo strip and Tech Globe remain. The background now uses a custom cyan/purple WebGL ink trail instead of code rain, moving masks and blurred mesh layers. Two small RGBA textures have a maximum long edge of 768 pixels (512 on narrow screens). Pointer input is coalesced, strokes are interpolated, and rendering is limited to 30 FPS, dropping to 20 after slow frames. The effect stops after 2.8 seconds without input and clears while scrolling or hidden. Touch, reduced-motion and unavailable WebGL use the static atmospheric background. GPU resources and listeners are cleaned up on unmount.

The paint test uses a mocked WebGL API to verify lifecycle, scheduling and fallback behavior; it does not verify GPU shader output, appearance or real-device frame times. Browser visual and performance verification remains necessary.
