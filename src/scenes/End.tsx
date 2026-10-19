import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT_DISPLAY, FONT_NUM } from "../theme";
import { Backdrop } from "../components/Backdrop";
import { RiseText, FadeUp } from "../components/Text";
import { ModeMeta, ModeKey, ModeGlyph } from "../components/ModeGlyph";
import { ramp } from "../lib/anim";

/** 06 — 收尾 */
export const End: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = ramp(frame, 96, 28, 1, 0);

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Backdrop accent={C.cyan} glow={0.7} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 40, marginBottom: 56 }}>
          {(["bridge", "nat", "host"] as ModeKey[]).map((k, i) => {
            const m = ModeMeta[k];
            const p = ramp(frame, 2 + i * 8, 16);
            return (
              <div key={k} style={{ opacity: p, transform: `translateY(${(1 - p) * 18}px) scale(${0.85 + p * 0.15})` }}>
                <ModeGlyph kind={k} color={m.color} size={72} progress={p} />
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
          {(["bridge", "nat", "host"] as ModeKey[]).map((k, i) => (
            <React.Fragment key={k}>
              {i > 0 && (
                <span style={{ fontFamily: FONT_NUM, fontSize: 30, color: "rgba(140,165,200,0.35)" }}>·</span>
              )}
              <RiseText
                text={ModeMeta[k].zh}
                start={18 + i * 5}
                stagger={1}
                style={{ fontSize: 54, color: ModeMeta[k].color, letterSpacing: 3 }}
              />
            </React.Fragment>
          ))}
        </div>

        <FadeUp start={48} distance={14} style={{ marginTop: 40 }}>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 26,
              letterSpacing: 10,
              color: "rgba(160,182,212,0.55)",
            }}
          >
            原理 · 区别 · 怎么选
          </div>
        </FadeUp>

        <FadeUp start={62} distance={12} style={{ marginTop: 78 }}>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 30,
              letterSpacing: 8,
              color: "rgba(210,225,245,0.82)",
              padding: "12px 34px",
              border: "1.4px solid rgba(150,178,225,0.25)",
              borderRadius: 999,
            }}
          >
            VIBE 知识大赏
          </div>
        </FadeUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
