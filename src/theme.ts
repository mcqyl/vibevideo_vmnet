export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION = 4056; // 135.2s

export const C = {
  bg: "#05070D",
  bg2: "#0A101C",
  ink: "#F3F7FF",
  ink2: "#C3D0E6",
  dim: "#7C8CA8",
  line: "rgba(150,178,225,0.16)",
  lineStrong: "rgba(160,190,240,0.34)",

  cyan: "#2FE0F5",
  violet: "#A78BFA",
  lime: "#B4EF4A",
  amber: "#FFC24B",
  rose: "#FF6B81",
  white: "#FFFFFF",
} as const;

export type Accent = keyof Pick<typeof C, "cyan" | "violet" | "lime" | "amber" | "rose">;

export const FONT_DISPLAY = "MSYHBD, Microsoft YaHei, sans-serif";
export const FONT_BODY = "MSYH, Microsoft YaHei, sans-serif";
export const FONT_NUM = "Bahnschrift, MSYHBD, sans-serif";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
