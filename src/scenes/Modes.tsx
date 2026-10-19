import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT_BODY, FONT_DISPLAY, FONT_NUM } from "../theme";
import { Backdrop } from "../components/Backdrop";
import { RiseText, FadeUp } from "../components/Text";
import { ModeGlyph, ModeMeta, ModeKey } from "../components/ModeGlyph";
import { ramp } from "../lib/anim";
import { beatPulse } from "../beats";

const ORDER: ModeKey[] = ["bridge", "nat", "host"];
const AT = [0, 16, 32];

/** 01 — 三种模式预告 */
export const Modes: React.FC = () => {
  const frame = useCurrentFrame();
  const bp = beatPulse(frame, 7);

  return (
    <AbsoluteFill>
      <Backdrop accent={C.cyan} glow={0.85 + bp * 0.3} />

      <div style={{ position: "absolute", left: 120, top: 150 }}>
        <div
          style={{
            fontFamily: FONT_NUM,
            fontSize: 20,
            letterSpacing: 8,
            color: `${C.cyan}cc`,
            opacity: ramp(frame, 0, 14),
          }}
        >
          THREE MODES
        </div>
        <RiseText
          text="三种模式"
          start={2}
          stagger={2}
          style={{ fontSize: 112, color: C.ink, letterSpacing: 4, marginTop: 12 }}
        />
        <FadeUp start={26} distance={20}>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 38,
              color: "rgba(180,200,228,0.72)",
              letterSpacing: 2,
              marginTop: 10,
            }}
          >
            同一台宿主机，三条完全不同的路
          </div>
        </FadeUp>
      </div>

      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 470,
          display: "flex",
          gap: 60,
        }}
      >
        {ORDER.map((k, i) => {
          const m = ModeMeta[k];
          const p = ramp(frame, AT[i], 18);
          const glow = i === 2 ? bp : 0;
          return (
            <div
              key={k}
              style={{
                width: 520,
                height: 330,
                borderRadius: 22,
                border: `1.6px solid ${m.color}${p > 0.5 ? "66" : "22"}`,
                background: `linear-gradient(160deg, ${m.color}14 0%, rgba(10,16,26,0.72) 55%)`,
                padding: "34px 34px 0",
                opacity: p,
                transform: `translateY(${(1 - p) * 44}px) scale(${0.94 + p * 0.06})`,
                boxShadow: `0 0 0 1px ${m.color}${Math.round(glow * 60).toString(16).padStart(2, "0")}, 0 24px 60px rgba(0,0,0,0.45)`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 28,
                  top: 22,
                  fontFamily: FONT_NUM,
                  fontSize: 92,
                  fontWeight: 700,
                  color: "transparent",
                  WebkitTextStroke: `1.2px ${m.color}55`,
                  lineHeight: 1,
                }}
              >
                {m.no}
              </div>

              <ModeGlyph kind={k} color={m.color} size={76} progress={p} />

              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 54,
                  color: C.ink,
                  marginTop: 22,
                  letterSpacing: 1,
                }}
              >
                {m.zh}
              </div>
              <div
                style={{
                  fontFamily: FONT_NUM,
                  fontSize: 18,
                  letterSpacing: 6,
                  color: `${m.color}cc`,
                  marginTop: 2,
                }}
              >
                {m.en}
              </div>
              <div
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 25,
                  color: "rgba(178,198,226,0.8)",
                  marginTop: 16,
                  letterSpacing: 0.5,
                }}
              >
                {m.one}
              </div>

              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: 3,
                  width: `${p * 100}%`,
                  background: `linear-gradient(90deg, ${m.color}, ${m.color}22)`,
                }}
              />
            </div>
          );
        })}
      </div>

      <FadeUp start={64} distance={16}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 108,
            textAlign: "center",
            fontFamily: FONT_DISPLAY,
            fontSize: 34,
            letterSpacing: 6,
            color: "rgba(170,192,222,0.55)",
          }}
        >
          它们到底差在哪 ？
        </div>
      </FadeUp>
    </AbsoluteFill>
  );
};
