import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const root = path.resolve(".");
const outDir = path.join(root, "docs");
fs.mkdirSync(outDir, { recursive: true });

const shots = [
  { frame: 700, name: "preview-1-title.jpg" },
  { frame: 900, name: "preview-2-bridge.jpg" },
  { frame: 1520, name: "preview-3-nat.jpg" },
  { frame: 2650, name: "preview-4-spectrum.jpg" },
  { frame: 3080, name: "preview-5-compare.jpg" },
  { frame: 3800, name: "preview-6-outro.jpg" },
];

const bundleLocation = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  onProgress: () => {},
});

const composition = await selectComposition({
  serveUrl: bundleLocation,
  id: "Video",
});

for (const shot of shots) {
  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output: path.join(outDir, shot.name),
    frame: shot.frame,
    scale: 0.6667,
    imageFormat: "jpeg",
    jpegQuality: 86,
  });
  console.log("rendered", shot.name);
}

process.exit(0);
