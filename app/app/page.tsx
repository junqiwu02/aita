"use client";

import { Composition } from "./composition";
import Renderer from "./renderer";
import { Player } from "@remotion/player";
import { useAudioContext } from "@/app/audio-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranscriber } from "../lib/hooks";
import { Progress } from "@/components/ui/progress";


export default function Preview() {
  const fps = 30;

  const { title, body } = useAudioContext();
  const [ transcriptionPercentage, transcribe ] = useTranscriber();
  const router = useRouter();

  if (!title.text) {
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
          durationInFrames={durationInFrames}
          compositionWidth={720}
          compositionHeight={1280}
          fps={fps}
          style={{ height: "75vh" }}
          controls
        />
        <div className="flex justify-center py-2">
          <Renderer />
          <Button onClick={() => {transcribe()}}>Transcribe</Button>
          <Progress value={transcriptionPercentage} />
        </div>
      </div>
    </>
  );
}
