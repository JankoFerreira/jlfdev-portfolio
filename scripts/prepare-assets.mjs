import { cp, mkdir } from "node:fs/promises";
await mkdir("app/public",{recursive:true});
for (const directory of ["media","images"]) await cp(directory,"app/public/"+directory,{recursive:true});
await cp("CNAME","app/public/CNAME");

