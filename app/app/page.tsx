"use client";

import { Composition } from "@/app/components/composition";
import { Player } from "@remotion/player";
import { useContent } from "@/app/providers/content-provider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRenderer } from "../providers/renderer-provider";
import StartOptions from "../components/start-options";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function Preview() {
  const fps = 30;

  const { title, body } = useContent();
  const { resURL, progress } = useRenderer();

  if (!title.text) {
    // no generated content
    return (
      <>
        <Card>
          <CardHeader>
            Create Video 🖌️
            <CardDescription>
              Choose an option to get started!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="h-[65vh] flex align-middle">
            <StartOptions></StartOptions>
          </CardContent>

          <CardFooter>
          </CardFooter>
        </Card>
      </>
    );
  }

  const durationInFrames = Math.ceil((body.at(-1)?.timestamp[1] || 0) * fps);

  return (
    <>
      <Card>
        <CardHeader>
          Video Preview ▶️
          <CardDescription>
            Don&apos;t close or refresh the page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Player
            component={Composition}
            durationInFrames={durationInFrames}
            compositionWidth={720}
            compositionHeight={1280}
            fps={fps}
            style={{ height: "65vh" }}
            controls
          />
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
            {resURL ? (
              <Button asChild>
                <a download="aita-download" href={resURL}>
                  Download ⬇️
                </a>
              </Button>
            ) : (
              <div>
                <p className="mb-2 text-xs">Prepping download...</p>
                <Progress value={progress} />
              </div>
            )}
            <Button variant="secondary" disabled>Create Another</Button>
        </CardFooter>
      </Card>
    </>
  );
}
