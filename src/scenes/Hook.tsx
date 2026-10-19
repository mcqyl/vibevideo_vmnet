import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT_DISPLAY, FONT_NUM } from "../theme";
import { Backdrop } from "../components/Backdrop";
import { RiseText, FadeUp } from "../components/Text";
import { ramp } from "../lib/anim";
import { beatPulse } from "../beats";

/** 01 — 痛点引入 */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const err = ramp(frame, 46, 12);
  const fix = ramp(frame, 80, 16);
  const shake = Math.max(0, 1 - (frame - 46) / 14);
  const bp = beatPulse(frame, 7);

  return (
    <AbsoluteFill>
      <Backdrop accent={fix > 0.3 ? C.cyan : C.rose} glow={0.8 + bp * 0.3} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 244, textAlign: "center" }}>
        <RiseText
          text="装好虚拟机，第一件事"
          start={0}
          stagger={1}
          style={{ fontSize: 44, color: "rgba(178,198,226,0.7)", letterSpacing: 6, justifyContent: "center" }}
        />
        <RiseText
          text="让它上网"
          start={16}
          stagger={3}
          style={{ fontSize: 138, color: C.ink, letterSpacing: 8, justifyContent: "center", marginTop: 10 }}
        />
      </div>

      {/* 报错卡 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 590,
          transform: `translate(-50%, 0) translateX(${Math.sin(frame * 2.4) * 6 * shake}px) scale(${0.9 + err * 0.1})`,
          opacity: err,
          width: 620,
          height: 150,
          borderRadius: 18,
          border: `1.6px solid ${C.rose}66`,
          background: "linear-gradient(180deg, rgba(40,12,20,0.9) 0%, rgba(16,10,16,0.9) 100%)",
          boxShadow: `0 0 60px ${C.rose}22`,
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "0 34px",
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            border: `2px solid ${C.rose}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24">
            <path d="M12 7v7" stroke={C.rose} strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="12" cy="18" r="1.6" fill={C.rose} />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, color: "rgba(255,225,230,0.95)", letterSpacing: 1 }}>
            无法访问网络
          </div>
          <div style={{ fontFamily: FONT_NUM, fontSize: 18, letterSpacing: 2, color: "rgba(255,140,160,0.7)", marginTop: 6 }}>
            NETWORK UNREACHABLE
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: FONT_NUM, fontSize: 18, letterSpacing: 2, color: "rgba(255,140,160,0.45)" }}>
          eth0 down
        </div>
      </div>

      <FadeUp start={80} distance={18}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 790,
            textAlign: "center",
            fontFamily: FONT_DISPLAY,
            fontSize: 46,
            letterSpacing: 3,
            color: "rgba(205,220,242,0.85)",
          }}
        >
          八成是
          <span style={{ color: C.cyan, padding: "0 8px", textShadow: `0 0 36px ${C.cyan}66` }}>
            网络模式
          </span>
          没选对
        </div>
      </FadeUp>
    </AbsoluteFill>
  );
};
