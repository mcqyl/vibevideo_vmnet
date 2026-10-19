import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT_DISPLAY, FONT_NUM } from "../theme";
import { Backdrop } from "../components/Backdrop";
import { FadeUp } from "../components/Text";
import { ramp } from "../lib/anim";
import { barPulse, beatPulse } from "../beats";

/** 00 — 开场：VMware 网络工作模式 */
export const Open: React.FC = () => {
  const frame = useCurrentFrame();
  const bp = beatPulse(frame, 6);
  const bbp = barPulse(frame, 8);

  const slam = ramp(frame, 14, 12);
  const line = ramp(frame, 18, 18);
  const sub = ramp(frame, 79, 18);
  const pills = ramp(frame, 95, 16);
  const exit = ramp(frame, 130, 13, 1, 0.88);

  return (
    <AbsoluteFill style={{ transform: `scale(${1 + bbp * 0.012})`, opacity: exit }}>
      <Backdrop accent={C.cyan} glow={0.9 + bp * 0.5} />

      {/* 主标题 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 258,
          textAlign: "center",
          transform: `scale(${1 + (1 - slam) * 0.12})`,
          filter: `blur(${(1 - slam) * 14}px)`,
          opacity: Math.min(1, slam * 1.7),
        }}
      >
        <div
          style={{
            fontFamily: FONT_NUM,
            fontSize: 212,
            fontWeight: 700,
            letterSpacing: 12,
            lineHeight: 1,
            color: "#F7FAFF",
            textShadow: `0 0 70px ${C.cyan}55, 0 0 160px ${C.cyan}22`,
          }}
        >
          VMware
        </div>
      </div>

      {/* 分隔线 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 512,
          width: 1200,
          height: 1.5,
          transform: `translateX(-50%) scaleX(${line})`,
          background: `linear-gradient(90deg, transparent, ${C.cyan}aa 30%, ${C.cyan}dd 50%, ${C.cyan}aa 70%, transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 511,
          width: 420,
          height: 4,
          borderRadius: 2,
          transform: `translateX(-50%) scaleX(${line})`,
          background: C.cyan,
          filter: "blur(9px)",
          opacity: 0.55 * line,
        }}
      />

      {/* 副标题 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 552,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 26}px)`,
        }}
      >
        <div style={{ width: 54, height: 1.5, background: `${C.cyan}88` }} />
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 76,
            letterSpacing: 18,
            color: "rgba(228,239,255,0.95)",
          }}
        >
          网络工作模式
        </div>
        <div style={{ width: 54, height: 1.5, background: `${C.cyan}88` }} />
      </div>

      {/* 标签 */}
      <FadeUp start={95} distance={18} style={{ position: "absolute", left: 0, right: 0, top: 700 }}>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          {["原理", "区别", "怎么选"].map((s, i) => (
            <div
              key={s}
              style={{
                padding: "10px 30px",
                borderRadius: 999,
                border: `1.4px solid ${C.cyan}44`,
                background: `${C.cyan}10`,
                fontFamily: FONT_DISPLAY,
                fontSize: 26,
                letterSpacing: 7,
                color: "rgba(190,215,245,0.85)",
                opacity: 1 - i * 0.16,
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </FadeUp>

      {/* 角标 */}
      <div
        style={{
          position: "absolute",
          left: 120,
          bottom: 78,
          fontFamily: FONT_NUM,
          fontSize: 18,
          letterSpacing: 6,
          color: "rgba(140,165,200,0.45)",
          opacity: ramp(frame, 20, 20),
        }}
      >
        VIBE 知识大赏 / 2026
      </div>
      <div
        style={{
          position: "absolute",
          right: 120,
          bottom: 78,
          fontFamily: FONT_NUM,
          fontSize: 18,
          letterSpacing: 6,
          color: "rgba(140,165,200,0.45)",
          opacity: ramp(frame, 20, 20),
        }}
      >
        EP.01
      </div>

      {/* 底部进度条 */}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          bottom: 56,
          height: 1,
          background: "rgba(150,178,225,0.12)",
        }}
      >
        <div
          style={{
            width: `${ramp(frame, 0, 143) * 100}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${C.cyan}00, ${C.cyan}88)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
