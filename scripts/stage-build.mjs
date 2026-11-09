import { cp } from "node:fs/promises";
// GitHub Pages serves the repository root. Keep editable source in app/.
await cp("dist/index.html","index.html");
await cp("dist/assets","assets",{recursive:true});

