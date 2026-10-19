import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  continueRender,
  delayRender,
  useCurrentFrame,
} from "remotion";
import { C, FONT_DISPLAY } from "./theme";
import { hitPulse } from "./beats";
import { SfxLayer } from "./components/SfxLayer";
import { Open } from "./scenes/Open";
import { Hook } from "./scenes/Hook";
import { Modes } from "./scenes/Modes";
import { Ask } from "./scenes/Ask";
import { ModeTitle, ModeKeys } from "./scenes/Chapter";
import { DiagramScene } from "./scenes/DiagramScene";
import { Break } from "./scenes/Break";
import { Compare } from "./scenes/Compare";
import { Finale } from "./scenes/Finale";
import { End } from "./scenes/End";

const CUTS = [0, 143, 271, 398, 653, 781, 1101, 1291, 1418, 1738, 1929, 2056, 2376, 2560, 2815, 3453, 3930];

const useFonts = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));

  useEffect(() => {
    const css = `
      @font-face { font-family: 'MSYHBD'; src: url('${staticFile("fonts/MSYH-Bold.ttf")}') format('truetype'); font-weight: 100 900; font-display: block; }
      @font-face { font-family: 'MSYH'; src: url('${staticFile("fonts/MSYH.ttf")}') format('truetype'); font-weight: 100 900; font-display: block; }
      @font-face { font-family: 'Bahnschrift'; src: url('${staticFile("fonts/Bahnschrift.ttf")}') format('truetype'); font-weight: 100 900; font-display: block; }
    `;
    const style = document.createElement("style");
    style.id = "vm-fonts";
    style.textContent = css;
    document.head.appendChild(style);

    const done = () => continueRender(handle);
    Promise.all([
      document.fonts.load("700 100px MSYHBD"),
      document.fonts.load("700 100px MSYH"),
      document.fonts.load("700 100px Bahnschrift"),
    ])
      .then(done)
      .catch(done);
  }, [handle]);
};

const Camera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const punch = Math.max(
    ...CUTS.map((c) => (frame >= c ? Math.exp(-(frame - c) / 4.5) : 0)),
  );
  const hit = hitPulse(frame, 5);
  const scale = 1.012 + punch * 0.016 + hit * 0.008;
  const rot = Math.sin(frame / 420) * 0.12;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) rotate(${rot}deg) translate(${Math.sin(frame / 300) * 3}px, ${Math.cos(frame / 360) * 3}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const punch = Math.max(
    ...CUTS.map((c) => (frame >= c ? Math.exp(-(frame - c) / 3.2) : 0)),
  );
  const hit = hitPulse(frame, 4);
  const a = punch * 0.16 + hit * 0.1;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(60% 50% at 50% 50%, #ffffff 0%, ${C.cyan}88 60%, transparent 100%)`,
        opacity: a,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};

const Letterbox: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: "rgba(255,255,255,0.05)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: "rgba(255,255,255,0.05)" }} />
  </>
);

export const Video: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: FONT_DISPLAY }}>
      <Camera>
        {/* 00 开场 */}
        <Sequence from={0} durationInFrames={143}>
          <Open />
        </Sequence>
        {/* 01 痛点 */}
        <Sequence from={143} durationInFrames={128}>
          <Hook />
        </Sequence>
        {/* 02 三种模式 */}
        <Sequence from={271} durationInFrames={127}>
          <Modes />
        </Sequence>
        {/* 03 问题 */}
        <Sequence from={398} durationInFrames={255}>
          <Ask />
        </Sequence>

        {/* 04 桥接 */}
        <Sequence from={653} durationInFrames={128}>
          <ModeTitle mode="bridge" />
        </Sequence>
        <Sequence from={781} durationInFrames={320}>
          <DiagramScene mode="bridge" />
        </Sequence>
        <Sequence from={1101} durationInFrames={190}>
          <ModeKeys mode="bridge" />
        </Sequence>

        {/* 05 NAT */}
        <Sequence from={1291} durationInFrames={127}>
          <ModeTitle mode="nat" />
        </Sequence>
        <Sequence from={1418} durationInFrames={320}>
          <DiagramScene mode="nat" />
        </Sequence>
        <Sequence from={1738} durationInFrames={191}>
          <ModeKeys mode="nat" />
        </Sequence>

        {/* 06 仅主机 */}
        <Sequence from={1929} durationInFrames={127}>
          <ModeTitle mode="host" />
        </Sequence>
        <Sequence from={2056} durationInFrames={320}>
          <DiagramScene mode="host" />
        </Sequence>
        <Sequence from={2376} durationInFrames={184}>
          <ModeKeys mode="host" />
        </Sequence>

        {/* 07 间奏 */}
        <Sequence from={2560} durationInFrames={255}>
          <Break />
        </Sequence>

        {/* 08 对比 */}
        <Sequence from={2815} durationInFrames={638}>
          <Compare />
        </Sequence>

        {/* 09 高潮 */}
        <Sequence from={3453} durationInFrames={477}>
          <Finale />
        </Sequence>

        {/* 10 收尾 */}
        <Sequence from={3930} durationInFrames={126}>
          <End />
        </Sequence>
      </Camera>

      <Flash />
      <Letterbox />

      {/* 背景音乐 */}
      <Audio
        src={staticFile("audio/bgm.mp3")}
        volume={(f) =>
          interpolate(f, [0, 18, 4000, 4055], [0, 0.62, 0.62, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      {/* 画面音效 */}
      <SfxLayer />
    </AbsoluteFill>
  );
};
