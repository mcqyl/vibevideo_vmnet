import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT_DISPLAY, FONT_NUM } from "../theme";
import { Backdrop } from "../components/Backdrop";
import { RiseText, FadeUp } from "../components/Text";
import { ModeMeta, ModeKey, ModeGlyph } from "../components/ModeGlyph";
import { ramp } from "../lib/anim";

const NODES: { k: ModeKey; x: number; one: string; at: number }[] = [
  { k: "bridge", x: 330, one: "像给虚拟机插了根网线", at: 22 },
  { k: "nat", x: 800, one: "像全家共用一个宽带账号", at: 46 },
  { k: "host", x: 1270, one: "像两台机器私下拉了根线", at: 70 },
];

/** 03 — 间奏：三种网络位置 */
export const Break: React.FC = () => {
  const frame = useCurrentFrame();
  const axis = ramp(frame, 0, 26);
  const end = ramp(frame, 96, 20);

  return (
    <AbsoluteFill>
      <Backdrop accent={C.violet} glow={0.55} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
        <div
          style={{
            fontFamily: FONT_NUM,
            fontSize: 20,
            letterSpacing: 8,
            color: "rgba(140,170,210,0.55)",
            opacity: ramp(frame, 0, 14),
          }}
        >
          SPECTRUM
        </div>
        <RiseText
          text="其实是三种网络位置"
          start={2}
          stagger={2}
          style={{ fontSize: 84, color: C.ink, letterSpacing: 4, justifyContent: "center", marginTop: 10 }}
        />
      </div>

      <div style={{ position: "absolute", left: 160, top: 400, width: 1600, height: 460 }}>
        <svg viewBox="0 0 1600 460" width="100%" height="100%">
          <defs>
            <linearGradient id="specGrad" gradientUnits="userSpaceOnUse" x1="150" y1="0" x2="1450" y2="0">
              <stop offset="0%" stopColor={C.cyan} />
              <stop offset="50%" stopColor={C.violet} />
              <stop offset="100%" stopColor={C.lime} />
            </linearGradient>
          </defs>

          {/* 轴线 */}
          <line
            x1="150"
            y1="250"
            x2="1450"
            y2="250"
            stroke="url(#specGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - axis}
            opacity={0.85}
          />
          <line x1="150" y1="250" x2="1450" y2="250" stroke="url(#specGrad)" strokeWidth="12" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - axis} opacity={0.12} />

          {NODES.map((n) => {
            const m = ModeMeta[n.k];
            const p = ramp(frame, n.at, 18);
            return (
              <g key={n.k} opacity={p}>
                <line x1={n.x} y1="250" x2={n.x} y2={250 - 56 * p} stroke={m.color} strokeWidth={2} opacity={0.5} />
                <circle cx={n.x} cy="250" r={9 + p * 5} fill={m.color} />
                <circle cx={n.x} cy="250" r={22 * p} fill="none" stroke={m.color} strokeWidth={1.4} opacity={0.35} />

                <text
                  x={n.x}
                  y="160"
                  textAnchor="middle"
                  fill={C.ink}
                  fontFamily={FONT_DISPLAY}
                  fontSize={40}
                  letterSpacing={1}
                >
                  {m.zh}
                </text>
                <text
                  x={n.x}
                  y="194"
                  textAnchor="middle"
                  fill={`${m.color}`}
                  fontFamily={FONT_NUM}
                  fontSize={15}
                  letterSpacing={5}
                >
                  {m.en}
                </text>
                <text
                  x={n.x}
                  y="310"
                  textAnchor="middle"
                  fill="rgba(185,205,232,0.75)"
                  fontFamily={FONT_DISPLAY}
                  fontSize={24}
                >
                  {n.one}
                </text>
              </g>
            );
          })}

          {/* 两端说明 */}
          <g opacity={end}>
            <text x="150" y="400" fill="rgba(160,185,220,0.55)" fontFamily={FONT_DISPLAY} fontSize={22} letterSpacing={2}>
              ← 更开放：局域网里人人可见
            </text>
            <text x="1450" y="400" textAnchor="end" fill="rgba(160,185,220,0.55)" fontFamily={FONT_DISPLAY} fontSize={22} letterSpacing={2}>
              更隔离：只和宿主机说话 →
            </text>
          </g>
        </svg>
      </div>

      <FadeUp start={150} distance={16}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 84,
            textAlign: "center",
            fontFamily: FONT_DISPLAY,
            fontSize: 30,
            letterSpacing: 5,
            color: "rgba(170,192,222,0.5)",
          }}
        >
          越往右，越安全，也越不自由
        </div>
      </FadeUp>
    </AbsoluteFill>
  );
};
