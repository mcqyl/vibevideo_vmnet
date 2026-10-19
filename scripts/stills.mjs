import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const frames = process.argv.slice(2).map((s) => Number(s));
const root = path.resolve(".");

const bundleLocation = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  onProgress: () => {},
});

const composition = await selectComposition({
  serveUrl: bundleLocation,
  id: "Video",
});

for (const frame of frames) {
  const output = path.join(root, "out", `f${String(frame).padStart(5, "0")}.png`);
  await renderStill({
    composition,
    serveUrl: bundleLocation,
    output,
    frame,
    imageFormat: "jpeg",
    jpegQuality: 92,
  });
  console.log("rendered", output);
}

process.exit(0);
