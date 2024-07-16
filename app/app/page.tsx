"use client";

import { Composition } from "@/app/components/composition";
import { Player } from "@remotion/player";
import { useContent } from "@/app/providers/content-provider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRenderer } from "../providers/renderer-provider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Preview() {
  const fps = 30;

  const { title, body } = useContent();
  const { downloadURL, progress } = useRenderer();

  if (!title.text) {
    // no generated content
    return (
      <Card className="relative">
        <Link
          href="/"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4"></ArrowLeft>
        </Link>
        <CardHeader>Video Preview ▶️</CardHeader>
        <CardContent className="h-[65vh] align-middle flex">
          <div className="text-center my-auto mx-24">
            <p className="text-sm text-muted-foreground">No video found!</p>
            <Button className="mt-4" variant="secondary" asChild>
              <Link href="/">Back</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const durationInFrames = Math.ceil((body.at(-1)?.timestamp[1] || 0) * fps);

  return (
    <>
      <Card className="relative">
        <Link
          href="/"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4"></ArrowLeft>
        </Link>
        <CardHeader>Video Preview ▶️</CardHeader>
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
          {downloadURL ? (
            <Button variant="secondary" asChild>
              <a download="shortsjs-download" href={downloadURL}>
                Download ⬇️
              </a>
            </Button>
          ) : (
            <div>
              <p className="mb-2 text-sm">
                Preparing download... don&apos;t close this page
              </p>
              <Progress value={progress} />
            </div>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
