"use client";

import { Composition } from "./composition";
import { Player } from "@remotion/player";
import { useContent } from "@/app/content-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRenderer } from "../renderer-provider";

export default function Preview() {
  const fps = 30;

  const { title, body } = useContent();
  const router = useRouter();
  const { resURL, progress } = useRenderer();

  if (!title.text) {
    // no generated content, redirect to home
    router.push("/");
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
          {resURL ? (
            <Button asChild>
              <a download="aita-download" href={resURL}>
                Download
              </a>
            </Button>
          ) : (
            <div>
              <p className="mb-2 w-[100%] text-center">
                Rendering... do not close this page.
              </p>
              <Progress value={progress} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
