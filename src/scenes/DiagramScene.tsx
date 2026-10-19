import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT_DISPLAY } from "../theme";
import { Backdrop } from "../components/Backdrop";
import { NetworkDiagram, Mode } from "../components/Diagram";
import { SceneHeader, ModeDots } from "../components/UI";
import { ModeMeta, ModeKey } from "../components/ModeGlyph";
import { ramp } from "../lib/anim";
import { beatPulse } from "../beats";

const CAPTION: Record<ModeKey, string> = {
  bridge: "虚拟机拿到的是局域网 IP，和宿主机同网段 —— 在局域网里，它就是一台独立机器",
  nat: "虚拟机的私有 IP 在出口被换成宿主机的 IP —— 外网只认得宿主机",
  host: "没有出口，只有宿主机 —— 虚拟机和外界彻底隔开",
};

const ORDER: ModeKey[] = ["bridge", "nat", "host"];

export const DiagramScene: React.FC<{ mode: ModeKey }> = ({ mode }) => {
  const m = ModeMeta[mode];
  const frame = useCurrentFrame();
  const bp = beatPulse(frame, 9);
  const cap = ramp(frame, 40, 20);

  return (
    <AbsoluteFill>
      <Backdrop accent={m.color} glow={0.5 + bp * 0.2} />
      <SceneHeader
        index={m.no}
        label={m.zh}
        en={m.en}
        accent={m.color}
        start={0}
        right="原理拓扑"
      />

      <div
        style={{
          position: "absolute",
          left: 160,
          top: 200,
          width: 1600,
          height: 680,
          opacity: ramp(frame, 0, 12),
        }}
      >
        <NetworkDiagram mode={mode as Mode} accent={m.color} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 150,
          right: 150,
          bottom: 96,
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: cap,
          transform: `translateY(${(1 - cap) * 16}px)`,
        }}
      >
        <div style={{ width: 4, height: 30, background: m.color, borderRadius: 2 }} />
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 28,
            color: "rgba(200,216,240,0.8)",
            letterSpacing: 0.6,
          }}
        >
          {CAPTION[mode]}
        </div>
      </div>

      <ModeDots active={ORDER.indexOf(mode)} accent={m.color} start={12} />
    </AbsoluteFill>
  );
};
