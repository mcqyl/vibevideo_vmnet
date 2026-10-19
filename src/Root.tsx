import { Composition } from "remotion";
import { Video } from "./Video";
import { DURATION, FPS, HEIGHT, WIDTH } from "./theme";

export const Root: React.FC = () => (
  <Composition
    id="Video"
    component={Video}
    durationInFrames={DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
