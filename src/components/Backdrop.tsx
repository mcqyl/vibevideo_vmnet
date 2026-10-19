import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { C } from "../theme";

export const Backdrop: React.FC<{
  accent?: string;
  glow?: number;
  grid?: boolean;
  vignette?: number;
}> = ({ accent = C.cyan, glow = 1, grid = true, vignette = 1 }) => {
  const frame = useCurrentFrame();
  const sx = 50 + Math.sin(frame / 190) * 12;
  const sy = 34 + Math.cos(frame / 240) * 8;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(115% 85% at ${sx}% ${sy}%, #0C1626 0%, #070C16 45%, #03050A 100%)`,
        }}
      />

      {/* 主光晕 */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(46% 40% at ${sx}% ${sy}%, ${accent}22 0%, transparent 62%)`,
          opacity: 0.9 * glow,
          mixBlendMode: "screen",
        }}
      />

      {/* 底部反光 */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 30% at 50% 108%, ${accent}18 0%, transparent 70%)`,
          opacity: glow,
        }}
      />

      {grid && (
        <AbsoluteFill
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(150,190,255,0.115) 1px, transparent 1.4px)",
            backgroundSize: "46px 46px",
            backgroundPosition: `${(frame * 0.16) % 46}px ${(frame * 0.1) % 46}px`,
            maskImage:
              "radial-gradient(72% 62% at 50% 46%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.35) 62%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(72% 62% at 50% 46%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.35) 62%, transparent 100%)",
          }}
        />
      )}

      {/* 扫描线 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${accent}0A 48%, ${accent}16 50%, ${accent}0A 52%, transparent 100%)`,
          height: 220,
          top: ((frame * 2.2) % 1500) - 260,
          position: "absolute",
          opacity: 0.5,
        }}
      />

      <AbsoluteFill
        style={{
          background: `radial-gradient(72% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)`,
          opacity: vignette,
        }}
      />

      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("grain.png")})`,
          backgroundSize: "512px 512px",
          backgroundPosition: `${(frame * 3.7) % 512}px ${(frame * 5.3) % 512}px`,
          opacity: 0.055,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};
