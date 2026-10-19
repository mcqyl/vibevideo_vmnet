import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT_DISPLAY, FONT_NUM } from "../theme";
import { Backdrop } from "../components/Backdrop";
import { RiseText, FadeUp } from "../components/Text";
import { ModeMeta, ModeKey } from "../components/ModeGlyph";
import { ramp } from "../lib/anim";

const ROUTES: { k: ModeKey; y: number }[] = [
  { k: "bridge", y: 90 },
  { k: "nat", y: 310 },
  { k: "host", y: 530 },
];

/** 02 — 提出问题 */
export const Ask: React.FC = () => {
  const frame = useCurrentFrame();
  const hostIn = ramp(frame, 20, 18);
  const routeIn = ramp(frame, 58, 30);

  return (
    <AbsoluteFill>
      <Backdrop accent={C.cyan} glow={0.8} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 128, textAlign: "center" }}>
        <div
          style={{
            fontFamily: FONT_NUM,
            fontSize: 20,
            letterSpacing: 8,
            color: "rgba(140,170,210,0.6)",
            opacity: ramp(frame, 0, 14),
          }}
        >
          THE QUESTION
        </div>
        <RiseText
          text="虚拟机想上网，路怎么走？"
          start={2}
          stagger={2}
          style={{ fontSize: 92, color: C.ink, letterSpacing: 4, justifyContent: "center", marginTop: 12 }}
        />
      </div>

      <div style={{ position: "absolute", left: 160, top: 320, width: 1600, height: 620 }}>
        <svg viewBox="0 0 1600 620" width="100%" height="100%">
          <defs>
            <linearGradient id="hostFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#122036" />
              <stop offset="100%" stopColor="#0A1220" />
            </linearGradient>
          </defs>

          {/* 宿主机 */}
          <g opacity={hostIn} transform={`translate(0 ${(1 - hostIn) * 24})`}>
            <rect x="40" y="170" width="330" height="280" rx="26" fill="url(#hostFill)" stroke="rgba(150,178,225,0.35)" strokeWidth={1.6} strokeDasharray="9 8" />
            <text x="64" y="212" fill="rgba(175,196,226,0.7)" fontFamily={FONT_DISPLAY} fontSize={18} letterSpacing={3}>
              宿主机
            </text>
            <rect x="80" y="244" width="250" height="170" rx="16" fill="rgba(20,32,52,0.9)" stroke={`${C.cyan}88`} strokeWidth={1.8} />
            <text x="102" y="292" fill={C.ink} fontFamily={FONT_DISPLAY} fontSize={26}>
              虚拟机
            </text>
            <text x="102" y="322" fill="rgba(190,208,232,0.6)" fontFamily={FONT_NUM} fontSize={15} letterSpacing={1.4}>
              Guest OS
            </text>
            <circle cx="290" cy="366" r="6" fill={C.cyan} opacity={0.8} />
          </g>

          {/* 三条路 */}
          {ROUTES.map((r, i) => {
            const m = ModeMeta[r.k];
            const p = ramp(frame, 58 + i * 6, 34);
            const lit = ramp(frame, 127 + i * 16, 14);
            const d = `M370 310 C 720 310 760 ${r.y} 1120 ${r.y}`;
            return (
              <g key={r.k}>
                <path
                  d={d}
                  fill="none"
                  stroke={lit > 0.1 ? m.color : "rgba(150,178,225,0.4)"}
                  strokeWidth={2.6}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                  opacity={0.4 + lit * 0.6}
                />
                <circle
                  cx={1120}
                  cy={r.y}
                  r={4 + lit * 5}
                  fill={m.color}
                  opacity={p * (0.35 + lit * 0.65)}
                />

                <g opacity={Math.max(p * 0.35, lit)} transform={`translate(${(1 - lit) * 18} 0)`}>
                  <rect
                    x="1160"
                    y={r.y - 48}
                    width="360"
                    height="96"
                    rx="18"
                    fill={lit > 0.1 ? `${m.color}16` : "rgba(14,22,36,0.7)"}
                    stroke={lit > 0.1 ? `${m.color}aa` : "rgba(150,178,225,0.22)"}
                    strokeWidth={1.6}
                  />
                  <text x="1192" y={r.y + 2} fill={lit > 0.1 ? C.ink : "rgba(200,215,240,0.7)"} fontFamily={FONT_DISPLAY} fontSize={34}>
                    {m.zh}
                  </text>
                  <text x="1192" y={r.y + 32} fill={lit > 0.1 ? `${m.color}` : "rgba(150,175,210,0.5)"} fontFamily={FONT_NUM} fontSize={16} letterSpacing={5}>
                    {m.en}
                  </text>
                  <text x="1490" y={r.y + 10} textAnchor="end" fill={lit > 0.1 ? m.color : "rgba(140,165,200,0.3)"} fontFamily={FONT_NUM} fontSize={30} fontWeight={700}>
                    {m.no}
                  </text>
                </g>
              </g>
            );
          })}

          {/* 出发点 */}
          <circle cx="370" cy="310" r={6} fill={C.cyan} opacity={hostIn} />
          <circle cx="370" cy="310" r={14} fill="none" stroke={C.cyan} strokeWidth={1.4} opacity={hostIn * 0.5} />
        </svg>
      </div>

      <FadeUp start={190} distance={18}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 92,
            textAlign: "center",
            fontFamily: FONT_DISPLAY,
            fontSize: 32,
            letterSpacing: 3,
            color: "rgba(180,200,228,0.62)",
          }}
        >
          先看最直接的一种：把虚拟机，直接接进局域网
        </div>
      </FadeUp>
    </AbsoluteFill>
  );
};
