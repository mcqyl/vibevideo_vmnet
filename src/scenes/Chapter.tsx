import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT_DISPLAY, FONT_NUM } from "../theme";
import { Backdrop } from "../components/Backdrop";
import { ChapterTitle, KeyRow, Verdict, ModeDots } from "../components/UI";
import { ModeMeta, ModeKey, ModeGlyph } from "../components/ModeGlyph";
import { ramp } from "../lib/anim";
import { beatPulse } from "../beats";

const KEYS: Record<
  ModeKey,
  { metaphor: string; rows: { mark: "yes" | "no" | "dot"; title: string; note: string }[]; verdict: string }
> = {
  bridge: {
    metaphor: "虚拟机的网卡，像是直接插在了你办公室的交换机上",
    rows: [
      { mark: "yes", title: "拿到局域网 IP，和宿主机平级", note: "同一网段，局域网里它就是一台独立机器" },
      { mark: "yes", title: "可以被局域网其他设备访问", note: "适合跑对外服务：网站、数据库、远程桌面" },
      { mark: "no", title: "占一个真实 IP，容易冲突", note: "IP 不够用，或公司网络禁止时很麻烦" },
    ],
    verdict: "适合：需要被局域网内其他机器访问的虚拟机",
  },
  nat: {
    metaphor: "虚拟机不出门，所有请求都由宿主机代为转发",
    rows: [
      { mark: "yes", title: "最省事：装好就能上网", note: "不用申请 IP，不用改网络配置" },
      { mark: "no", title: "外网无法主动连入", note: "从外面看不到它，天然更安全" },
      { mark: "dot", title: "需要被访问时，做端口转发", note: "宿主机 8080 → 虚拟机 80" },
    ],
    verdict: "适合：日常开发、需要联网但不想暴露的虚拟机",
  },
  host: {
    metaphor: "只拉了一根网线，一头是宿主机，一头是虚拟机",
    rows: [
      { mark: "yes", title: "只能和宿主机互相通信", note: "虚拟机和宿主机之间可以自由互通" },
      { mark: "no", title: "不能访问外网", note: "局域网里也没有任何设备能看到它" },
      { mark: "dot", title: "隔离性最强，最安全", note: "常用于内网测试、靶场、双机实验" },
    ],
    verdict: "适合：内网测试、隔离环境、需要绝对安全的实验",
  },
};

const ORDER: ModeKey[] = ["bridge", "nat", "host"];

/** 右侧模式铭牌 */
const ModePlate: React.FC<{ mode: ModeKey; size?: number; top?: number; start?: number; glyph?: number }> = ({
  mode,
  size = 420,
  top = 300,
  start = 0,
  glyph = 190,
}) => {
  const m = ModeMeta[mode];
  const frame = useCurrentFrame();
  const p = ramp(frame, start, 20);
  const bp = beatPulse(frame, 9);
  const tick = 26;

  return (
    <div
      style={{
        position: "absolute",
        right: 150,
        top,
        width: size,
        height: size,
        borderRadius: 26,
        border: `1.4px solid ${m.color}${p > 0.4 ? "3a" : "14"}`,
        background: `radial-gradient(80% 70% at 50% 30%, ${m.color}12 0%, rgba(8,13,22,0.6) 70%)`,
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px) scale(${0.94 + p * 0.06})`,
        boxShadow: `0 0 ${60 + bp * 50}px ${m.color}${Math.round(10 + bp * 26).toString(16).padStart(2, "0")} inset`,
      }}
    >
      {/* 四角标记 */}
      {[
        { l: 14, t: 14, r: undefined, b: undefined },
        { r: 14, t: 14, l: undefined, b: undefined },
        { l: 14, b: 14, r: undefined, t: undefined },
        { r: 14, b: 14, l: undefined, t: undefined },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: tick,
            height: tick,
            left: pos.l,
            right: pos.r,
            top: pos.t,
            bottom: pos.b,
            borderLeft: pos.l !== undefined ? `1.6px solid ${m.color}88` : undefined,
            borderRight: pos.r !== undefined ? `1.6px solid ${m.color}88` : undefined,
            borderTop: pos.t !== undefined ? `1.6px solid ${m.color}88` : undefined,
            borderBottom: pos.b !== undefined ? `1.6px solid ${m.color}88` : undefined,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: size / 2 - glyph / 2 - 26,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ModeGlyph kind={mode} color={m.color} size={glyph} progress={p} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: size * 0.14,
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: FONT_NUM, fontSize: 20, letterSpacing: 8, color: `${m.color}cc` }}>
          {m.en}
        </div>
        <div
          style={{
            fontFamily: FONT_NUM,
            fontSize: 15,
            letterSpacing: 5,
            color: "rgba(150,175,210,0.4)",
            marginTop: 8,
          }}
        >
          {m.no} / 03
        </div>
      </div>
    </div>
  );
};

export const ModeTitle: React.FC<{ mode: ModeKey }> = ({ mode }) => {
  const m = ModeMeta[mode];
  const frame = useCurrentFrame();
  const bp = beatPulse(frame, 6);
  return (
    <AbsoluteFill>
      <Backdrop accent={m.color} glow={0.9 + bp * 0.3} />
      <ChapterTitle no={m.no} zh={m.zh} en={m.en} tagline={m.metaphor} accent={m.color} start={4} />
      <ModePlate mode={mode} size={520} top={276} start={18} glyph={240} />
      <ModeDots active={ORDER.indexOf(mode)} accent={m.color} start={20} />
    </AbsoluteFill>
  );
};

export const ModeKeys: React.FC<{ mode: ModeKey }> = ({ mode }) => {
  const m = ModeMeta[mode];
  const frame = useCurrentFrame();
  const data = KEYS[mode];
  const bp = beatPulse(frame, 8);

  return (
    <AbsoluteFill>
      <Backdrop accent={m.color} glow={0.55 + bp * 0.25} />

      <div
        style={{
          position: "absolute",
          left: 150,
          top: 206,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: ramp(frame, 0, 16),
        }}
      >
        <div style={{ width: 5, height: 40, background: m.color, borderRadius: 3 }} />
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 44,
            color: "rgba(205,220,242,0.82)",
            letterSpacing: 1,
          }}
        >
          {data.metaphor}
        </div>
      </div>

      <div style={{ position: "absolute", left: 150, right: 660, top: 396 }}>
        {data.rows.map((r, i) => (
          <KeyRow
            key={i}
            mark={r.mark}
            title={r.title}
            note={r.note}
            accent={m.color}
            start={18 + i * 22}
            index={i}
          />
        ))}
      </div>

      <ModePlate mode={mode} size={420} top={330} start={10} glyph={170} />

      <Verdict accent={m.color} start={110}>
        {data.verdict}
      </Verdict>
      <ModeDots active={ORDER.indexOf(mode)} accent={m.color} start={20} />
    </AbsoluteFill>
  );
};
