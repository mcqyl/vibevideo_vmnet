import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT_DISPLAY, FONT_NUM } from "../theme";
import { ramp } from "../lib/anim";

export const ModeGlyph: React.FC<{
  kind: "bridge" | "nat" | "host";
  size?: number;
  color: string;
  progress?: number;
}> = ({ kind, size = 64, color, progress = 1 }) => {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth: 2.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const dash = 120 * (1 - progress);

  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {kind === "bridge" && (
        <g strokeDasharray={120} strokeDashoffset={dash}>
          <rect x="4" y="10" width="12" height="10" rx="2.5" {...common} />
          <rect x="32" y="10" width="12" height="10" rx="2.5" {...common} />
          <path d="M16 15h16" {...common} />
          <path d="M10 20v16M38 20v16" {...common} opacity={0.5} />
          <path d="M10 30h28" {...common} />
        </g>
      )}
      {kind === "nat" && (
        <g strokeDasharray={140} strokeDashoffset={dash * 1.2}>
          <rect x="4" y="6" width="11" height="11" rx="2.5" {...common} />
          <path d="M15 11.5h8" {...common} />
          <path d="M18 8.5l3 3-3 3" {...common} />
          <path d="M22 22v14" {...common} opacity={0.45} strokeDasharray="3 4" />
          <path d="M26 28h8" {...common} />
          <path d="M31 25l3 3-3 3" {...common} />
          <rect x="36" y="22" width="9" height="12" rx="2.5" {...common} opacity={0.55} />
        </g>
      )}
      {kind === "host" && (
        <g strokeDasharray={160} strokeDashoffset={dash * 1.2}>
          <rect x="7" y="14" width="14" height="12" rx="2.5" {...common} />
          <rect x="27" y="14" width="14" height="12" rx="2.5" {...common} />
          <path d="M21 20h6" {...common} />
          <rect x="3" y="8" width="42" height="32" rx="7" {...common} opacity={0.45} strokeDasharray="4 4" />
          <path d="M24 8v-4" {...common} opacity={0.4} />
        </g>
      )}
    </svg>
  );
};

export const ModeMeta = {
  bridge: {
    no: "01",
    zh: "桥接模式",
    en: "BRIDGED",
    color: C.cyan,
    one: "虚拟机直接接进物理局域网",
    metaphor: "等于给虚拟机单独插了一根网线",
  },
  nat: {
    no: "02",
    zh: "NAT 模式",
    en: "NAT",
    color: C.violet,
    one: "借宿主机上网，外网看不见它",
    metaphor: "像全家共用一个宽带账号出门",
  },
  host: {
    no: "03",
    zh: "仅主机模式",
    en: "HOST-ONLY",
    color: C.lime,
    one: "只能和宿主机通信，最安全",
    metaphor: "像两台机器之间拉了根网线，不与外界相连",
  },
} as const;

export type ModeKey = keyof typeof ModeMeta;
