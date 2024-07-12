"use client";

import { Composition } from "./composition";
import Renderer from "./renderer";
import { Player } from "@remotion/player";
import { useAudioContext } from "@/app/audio-provider";
import { useRouter } from "next/navigation";


export default function Preview() {
  const fps = 30;

  const { content } = useAudioContext();
  const router = useRouter();  

  const { title, body } = content;

  if (!title) {
    // no generated content, redirect to home
    router.push('/');
    return;
  }

  const durationInFrames = Math.ceil((body.at(-1)?.timestamp[1] || 0) * fps);

  return (
    <>
      <div className="block">
        <Player
          component={Composition}
          inputProps={{ content: content }}
          durationInFrames={durationInFrames}
          compositionWidth={720}
          compositionHeight={1280}
          fps={fps}
          style={{ height: "75vh" }}
          controls
        />
        <div className="flex justify-center py-2">
          <Renderer />
          {/* <Button onClick={() => {transcribe('/audios/output.mp3')}}>Transcribe</Button> */}
        </div>
      </div>
    </>
  );
}
