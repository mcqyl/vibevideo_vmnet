import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SFX } from "../sound";

/** 音效层：所有画面音效 */
export const SfxLayer: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {SFX.map((s, i) => (
      <Sequence key={i} from={s.at} durationInFrames={180} layout="none">
        <Audio src={staticFile(s.src)} volume={s.vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
