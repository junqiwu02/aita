"use client";

import { MyComposition } from "@/remotion/Composition";
import { Player } from "@remotion/player";

export default function Preview({ params }: { params: { id: string } }) {
  return (
    <>
      <Player
        component={MyComposition}
        inputProps={{ id: params.id }}
        durationInFrames={120}
        compositionWidth={720}
        compositionHeight={1280}
        fps={30}
        style={{ height: '75vh' }}
        controls
      />
    </>
  );
}
