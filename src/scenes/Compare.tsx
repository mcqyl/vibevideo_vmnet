import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT_DISPLAY, FONT_NUM } from "../theme";
import { Backdrop } from "../components/Backdrop";
import { SceneHeader } from "../components/UI";
import { ModeMeta, ModeKey, ModeGlyph } from "../components/ModeGlyph";
import { ramp } from "../lib/anim";
import { beatPulse } from "../beats";

type Cell = { t: string; ok: boolean | null };

const COLS: ModeKey[] = ["bridge", "nat", "host"];
const COLX = [660, 1010, 1360];

const ROWS: { label: string; v: Cell[] }[] = [
  {
    label: "能否访问外网",
    v: [
      { t: "可以", ok: true },
      { t: "可以", ok: true },
      { t: "不可以", ok: false },
    ],
  },
  {
    label: "局域网能否访问它",
    v: [
      { t: "可以", ok: true },
      { t: "需端口转发", ok: false },
      { t: "不可以", ok: false },
    ],
  },
  {
    label: "IP 地址从哪来",
    v: [
      { t: "局域网 DHCP", ok: null },
      { t: "宿主机分配", ok: null },
      { t: "宿主机分配", ok: null },
    ],
  },
  {
    label: "隔离性",
    v: [
      { t: "低", ok: null },
      { t: "中", ok: null },
      { t: "高", ok: null },
    ],
  },
  {
    label: "典型用途",
    v: [
      { t: "对外服务", ok: null },
      { t: "日常开发", ok: null },
      { t: "内网测试", ok: null },
    ],
  },
];

const PICKS = [
  { need: "需要被局域网里的其他机器访问", k: "bridge" as ModeKey, at: 372 },
  { need: "需要上网，但不想被外面看见", k: "nat" as ModeKey, at: 404 },
  { need: "只要本机互通，越隔离越安全", k: "host" as ModeKey, at: 436 },
];

const Check: React.FC<{ ok: boolean; color: string }> = ({ ok, color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    {ok ? (
      <path d="M4 12.5l5.2 5.2L20 6.5" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke={C.rose} strokeWidth="2.8" strokeLinecap="round" />
    )}
  </svg>
);

/** 04 — 三种模式对比 + 怎么选 */
export const Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const bp = beatPulse(frame, 9);

  const tableOut = ramp(frame, 322, 12, 1, 0);
  const pickIn = ramp(frame, 336, 16);

  return (
    <AbsoluteFill>
      <Backdrop accent={C.amber} glow={0.5 + bp * 0.2} />
      <SceneHeader index="04" label="三种模式对比" en="COMPARISON" accent={C.amber} start={0} right="一表看懂" />

      {/* 表格 */}
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 150,
          top: 210,
          opacity: tableOut,
          transform: `translateY(${(1 - tableOut) * -26}px)`,
        }}
      >
        {/* 表头 */}
        <div style={{ display: "flex", alignItems: "flex-end", height: 132, paddingBottom: 24, opacity: ramp(frame, 6, 16) }}>
          <div style={{ width: 510, fontFamily: FONT_NUM, fontSize: 18, letterSpacing: 6, color: "rgba(150,175,210,0.5)" }}>
            ITEM
          </div>
          {COLS.map((k, i) => {
            const m = ModeMeta[k];
            return (
              <div key={k} style={{ width: 350, display: "flex", alignItems: "center", gap: 16 }}>
                <ModeGlyph kind={k} color={m.color} size={42} />
                <div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, color: m.color, letterSpacing: 1 }}>{m.zh}</div>
                  <div style={{ fontFamily: FONT_NUM, fontSize: 13, letterSpacing: 4, color: `${m.color}88` }}>{m.en}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ height: 1.5, background: "linear-gradient(90deg, rgba(150,178,225,0.4), rgba(150,178,225,0.05))" }} />

        {ROWS.map((r, ri) => {
          const p = ramp(frame, 24 + ri * 26, 16);
          return (
            <div
              key={r.label}
              style={{
                display: "flex",
                alignItems: "center",
                height: 104,
                borderBottom: "1px solid rgba(150,178,225,0.10)",
                opacity: p,
                transform: `translateY(${(1 - p) * 18}px)`,
              }}
            >
              <div style={{ width: 510, fontFamily: FONT_DISPLAY, fontSize: 30, color: "rgba(205,220,242,0.88)", letterSpacing: 1 }}>
                {r.label}
              </div>
              {r.v.map((cell, ci) => {
                const m = ModeMeta[COLS[ci]];
                return (
                  <div key={ci} style={{ width: 350, display: "flex", alignItems: "center", gap: 12 }}>
                    {cell.ok !== null && <Check ok={cell.ok} color={m.color} />}
                    <span
                      style={{
                        fontFamily: FONT_DISPLAY,
                        fontSize: 28,
                        color:
                          cell.ok === null
                            ? "rgba(190,208,232,0.8)"
                            : cell.ok
                              ? m.color
                              : "rgba(255,120,140,0.85)",
                        letterSpacing: 0.5,
                      }}
                    >
                      {cell.t}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 怎么选 */}
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 150,
          top: 230,
          opacity: pickIn,
          transform: `translateY(${(1 - pickIn) * 30}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 54 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 96, color: C.ink, letterSpacing: 3 }}>怎么选</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, color: "rgba(160,182,212,0.6)", letterSpacing: 2 }}>
            看你的虚拟机，需不需要被"别人"找到
          </div>
        </div>

        {PICKS.map((pk, i) => {
          const m = ModeMeta[pk.k];
          const p = ramp(frame, pk.at, 16);
          return (
            <div
              key={pk.k}
              style={{
                display: "flex",
                alignItems: "center",
                height: 150,
                padding: "0 40px",
                marginBottom: 18,
                borderRadius: 18,
                border: `1.4px solid ${m.color}33`,
                background: `linear-gradient(90deg, ${m.color}12 0%, rgba(10,16,26,0.4) 70%)`,
                opacity: p,
                transform: `translateX(${(1 - p) * -34}px)`,
              }}
            >
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 40, color: "rgba(220,232,250,0.92)", width: 720, letterSpacing: 1 }}>
                {pk.need}
              </div>
              <div style={{ flex: 1, height: 1.5, background: `linear-gradient(90deg, ${m.color}55, ${m.color}11)` }} />
              <div style={{ width: 60, textAlign: "center", color: `${m.color}`, fontFamily: FONT_NUM, fontSize: 34 }}>
                →
              </div>
              <div style={{ width: 330, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16 }}>
                <ModeGlyph kind={pk.k} color={m.color} size={44} />
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 46, color: m.color, letterSpacing: 2 }}>{m.zh}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
