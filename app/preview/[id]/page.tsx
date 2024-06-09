"use client";

import { MyComposition } from "@/remotion/Composition";
import { Player } from "@remotion/player";

export default function Preview({ params }: { params: { id: string } }) {
  return (
    <Player
      component={MyComposition}
      inputProps={{ text: "World" }}
      durationInFrames={120}
      compositionWidth={1920}
      compositionHeight={1080}
      fps={30}
      style={{
        width: 1280,
        height: 720,
      }}
      controls
    />
  );
}
