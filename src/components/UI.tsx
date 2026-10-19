import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT_BODY, FONT_DISPLAY, FONT_NUM } from "../theme";
import { clamp01, ramp } from "../lib/anim";
import { FadeUp } from "./Text";

/* ------------------------------------------------------------ 章节页眉 */
export const SceneHeader: React.FC<{
  index?: string;
  label: string;
  en?: string;
  accent: string;
  start?: number;
  right?: string;
}> = ({ index, label, en, accent, start = 0, right }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, 18);

  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        right: 120,
        top: 76,
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: p,
        transform: `translateY(${(1 - p) * -14}px)`,
      }}
    >
      {index && (
        <div
          style={{
            fontFamily: FONT_NUM,
            fontSize: 22,
            letterSpacing: 3,
            color: accent,
            padding: "4px 12px",
            border: `1.5px solid ${accent}66`,
            borderRadius: 6,
            lineHeight: 1.1,
          }}
        >
          {index}
        </div>
      )}
      <div
        style={{
          width: 42,
          height: 2,
          background: accent,
          transform: `scaleX(${p})`,
          transformOrigin: "left center",
        }}
      />
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 26,
          letterSpacing: 4,
          color: "rgba(225,236,252,0.92)",
        }}
      >
        {label}
      </div>
      {en && (
        <div
          style={{
            fontFamily: FONT_NUM,
            fontSize: 18,
            letterSpacing: 5,
            color: "rgba(150,175,210,0.5)",
          }}
        >
          {en}
        </div>
      )}
      <div style={{ flex: 1 }} />
      {right && (
        <div
          style={{
            fontFamily: FONT_NUM,
            fontSize: 18,
            letterSpacing: 3,
            color: "rgba(150,175,210,0.42)",
          }}
        >
          {right}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------ 章节大标题 */
export const ChapterTitle: React.FC<{
  no: string;
  zh: string;
  en: string;
  tagline: string;
  accent: string;
  start?: number;
}> = ({ no, zh, en, tagline, accent, start = 0 }) => {
  const frame = useCurrentFrame();
  const ghost = ramp(frame, start + 4, 26);
  const bar = ramp(frame, start + 10, 22);

  return (
    <div style={{ position: "absolute", left: 150, top: 268, width: 1100 }}>
      <div
        style={{
          position: "absolute",
          left: -52,
          top: -206,
          fontFamily: FONT_NUM,
          fontSize: 420,
          fontWeight: 700,
          lineHeight: 0.8,
          color: "transparent",
          WebkitTextStroke: `1.5px ${accent}`,
          opacity: 0.11 * ghost,
          transform: `translateY(${(1 - ghost) * 40}px)`,
          letterSpacing: -8,
        }}
      >
        {no}
      </div>

      <div style={{ position: "relative" }}>
        <div
          style={{
            fontFamily: FONT_NUM,
            fontSize: 30,
            letterSpacing: 12,
            color: accent,
            opacity: ramp(frame, start + 6, 16),
            marginBottom: 6,
          }}
        >
          {en}
        </div>

        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 148,
            lineHeight: 1.02,
            color: C.ink,
            letterSpacing: 2,
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              display: "inline-block",
              clipPath: `inset(0 ${(1 - ramp(frame, start, 18)) * 100}% 0 0)`,
              transform: `translateY(${(1 - ramp(frame, start, 18)) * 26}px)`,
            }}
          >
            {zh}
          </span>
          <span
            style={{
              display: "inline-block",
              width: 18,
              height: 18,
              borderRadius: 9,
              background: accent,
              marginLeft: 16,
              marginBottom: 26,
              transform: `scale(${ramp(frame, start + 12, 14)})`,
            }}
          />
        </div>

        <div
          style={{
            height: 3,
            width: 900,
            marginTop: 26,
            background: `linear-gradient(90deg, ${accent} 0%, ${accent}00 100%)`,
            transform: `scaleX(${bar})`,
            transformOrigin: "left center",
          }}
        />

        <div
          style={{
            marginTop: 34,
            fontFamily: FONT_DISPLAY,
            fontSize: 40,
            color: "rgba(200,216,240,0.78)",
            letterSpacing: 1,
            opacity: ramp(frame, start + 22, 20),
            transform: `translateY(${(1 - ramp(frame, start + 22, 20)) * 18}px)`,
          }}
        >
          {tagline}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ 要点行 */
export const KeyRow: React.FC<{
  mark: "yes" | "no" | "dot";
  title: string;
  note?: string;
  accent: string;
  start: number;
  index?: number;
}> = ({ mark, title, note, accent, start, index = 0 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, 16);
  const color = mark === "no" ? C.rose : mark === "yes" ? accent : "rgba(170,195,225,0.7)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "20px 0",
        opacity: p,
        transform: `translateX(${(1 - p) * -40}px)`,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          border: `1.6px solid ${color}55`,
          background: `${color}14`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {mark === "yes" && (
          <svg width="26" height="26" viewBox="0 0 24 24">
            <path d="M4 12.5l5.2 5.2L20 6.5" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {mark === "no" && (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M5 5l14 14M19 5L5 19" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        )}
        {mark === "dot" && (
          <div style={{ width: 14, height: 14, borderRadius: 7, background: color }} />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 38,
            color: C.ink,
            letterSpacing: 0.6,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        {note && (
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 22,
              color: "rgba(155,175,205,0.8)",
              marginTop: 6,
              letterSpacing: 0.4,
            }}
          >
            {note}
          </div>
        )}
      </div>

    </div>
  );
};

/* ------------------------------------------------------------ 小胶囊 */
export const Chip: React.FC<{
  children: React.ReactNode;
  color: string;
  start: number;
  filled?: boolean;
  size?: number;
}> = ({ children, color, start, filled = false, size = 22 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, 14);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: `${size * 0.5}px ${size * 1.1}px`,
        borderRadius: 999,
        border: `1.5px solid ${color}${filled ? "cc" : "55"}`,
        background: filled ? `${color}22` : "transparent",
        color: filled ? color : "rgba(210,225,245,0.85)",
        fontFamily: FONT_DISPLAY,
        fontSize: size,
        letterSpacing: 1.5,
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------ 底部结语条 */
export const Verdict: React.FC<{
  children: React.ReactNode;
  accent: string;
  start: number;
}> = ({ children, accent, start }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, 20);
  return (
    <FadeUp start={start} distance={24}>
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 150,
          bottom: 92,
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "24px 34px",
          borderRadius: 16,
          border: `1.4px solid ${accent}3d`,
          background: `linear-gradient(90deg, ${accent}16 0%, rgba(10,16,26,0.5) 60%)`,
          backdropFilter: "blur(2px)",
        }}
      >
        <div style={{ width: 4, height: 34, background: accent, borderRadius: 2, opacity: p }} />
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 30,
            color: "rgba(228,238,252,0.94)",
            letterSpacing: 0.8,
          }}
        >
          {children}
        </div>
      </div>
    </FadeUp>
  );
};

/* ------------------------------------------------------------ 章节进度点 */
export const ModeDots: React.FC<{ active: number; accent: string; start?: number }> = ({
  active,
  accent,
  start = 0,
}) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, 16);
  return (
    <div
      style={{
        position: "absolute",
        right: 120,
        bottom: 78,
        display: "flex",
        gap: 10,
        opacity: p * 0.9,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: i === active ? 46 : 10,
            height: 6,
            borderRadius: 3,
            background: i === active ? accent : "rgba(150,178,225,0.25)",
          }}
        />
      ))}
    </div>
  );
};
