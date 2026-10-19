import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT_DISPLAY, FONT_NUM } from "../theme";
import { Backdrop } from "../components/Backdrop";
import { RiseText, FadeUp } from "../components/Text";
import { ModeMeta, ModeKey, ModeGlyph } from "../components/ModeGlyph";
import { ramp } from "../lib/anim";
import { beatPulse } from "../beats";

const LINES: { k: ModeKey; cond: string; at: number }[] = [
  { k: "bridge", cond: "要被人访问", at: 18 },
  { k: "nat", cond: "要能上网、又不想暴露", at: 74 },
  { k: "host", cond: "要绝对隔离", at: 130 },
];

/** 05 — 高潮：三句口诀 + 结论 */
export const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const bp = beatPulse(frame, 8);
  const outA = ramp(frame, 224, 10, 1, 0);
  const inB = ramp(frame, 232, 16);

  return (
    <AbsoluteFill>
      <Backdrop accent={C.amber} glow={0.8 + bp * 0.4} />

      {/* 三句口诀 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: outA }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 168,
            textAlign: "center",
            fontFamily: FONT_NUM,
            fontSize: 20,
            letterSpacing: 10,
            color: "rgba(150,175,210,0.55)",
            opacity: ramp(frame, 0, 14),
          }}
        >
          THREE SENTENCES
        </div>

        {LINES.map((l, i) => {
          const m = ModeMeta[l.k];
          const p = ramp(frame, l.at, 16);
          return (
            <div
              key={l.k}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 300 + i * 176,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 44,
                opacity: p,
                transform: `translateY(${(1 - p) * 26}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_NUM,
                  fontSize: 26,
                  letterSpacing: 3,
                  color: `${m.color}99`,
                  border: `1.4px solid ${m.color}44`,
                  borderRadius: 8,
                  padding: "4px 12px",
                }}
              >
                {m.no}
              </div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 62,
                  color: "rgba(214,228,246,0.9)",
                  letterSpacing: 2,
                }}
              >
                {l.cond}
              </div>
              <div style={{ fontFamily: FONT_NUM, fontSize: 46, color: `${m.color}99` }}>→</div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 96,
                  color: m.color,
                  letterSpacing: 3,
                  textShadow: `0 0 44px ${m.color}55`,
                }}
              >
                {m.zh}
              </div>
            </div>
          );
        })}
      </div>

      {/* 结论 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: inB }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 300,
            textAlign: "center",
            fontFamily: FONT_DISPLAY,
            fontSize: 44,
            letterSpacing: 8,
            color: "rgba(165,188,218,0.62)",
            opacity: ramp(frame, 238, 16),
          }}
        >
          选哪种，其实只取决于一件事
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: 396, textAlign: "center" }}>
          <RiseText
            text="这台虚拟机，"
            start={248}
            stagger={1}
            style={{ fontSize: 96, color: C.ink, letterSpacing: 3, justifyContent: "center" }}
          />
          <div style={{ height: 8 }} />
          <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 10 }}>
            <RiseText
              text="需不需要被外面"
              start={260}
              stagger={1}
              style={{ fontSize: 96, color: C.ink, letterSpacing: 3 }}
            />
            <RiseText
              text="看见"
              start={276}
              stagger={2}
              style={{ fontSize: 96, color: C.amber, letterSpacing: 3, textShadow: `0 0 50px ${C.amber}66` }}
            />
            <RiseText
              text="？"
              start={290}
              stagger={1}
              style={{ fontSize: 96, color: C.amber, letterSpacing: 3 }}
            />
          </div>
        </div>

        <FadeUp start={330} distance={18}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 760,
              display: "flex",
              justifyContent: "center",
              gap: 18,
            }}
          >
            {(["bridge", "nat", "host"] as ModeKey[]).map((k) => {
              const m = ModeMeta[k];
              return (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 24px",
                    borderRadius: 999,
                    border: `1.4px solid ${m.color}44`,
                    background: `${m.color}12`,
                    fontFamily: FONT_DISPLAY,
                    fontSize: 24,
                    letterSpacing: 2,
                    color: m.color,
                  }}
                >
                  <ModeGlyph kind={k} color={m.color} size={26} />
                  {m.zh}
                </div>
              );
            })}
          </div>
        </FadeUp>
      </div>
    </AbsoluteFill>
  );
};
