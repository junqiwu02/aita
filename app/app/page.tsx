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
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Preview() {
  const fps = 30;

  const { title, body } = useContent();
  const { downloadURL, progress } = useRenderer();
  const router = useRouter();

  if (!title.text) {
    // no generated content
    router.push("/new");
    return;
  }

  const durationInFrames = Math.ceil((body.at(-1)?.timestamp[1] || 0) * fps);

  return (
    <>
      <Card className="relative">
        <Link
          href="/new"
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
            <Button asChild>
              <a download="aita-download" href={downloadURL}>
                Download ⬇️
              </a>
            </Button>
          ) : (
            <div>
              <p className="mb-2 text-xs">
                Preparing download... don&apos;t close the page
              </p>
              <Progress value={progress} />
            </div>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
