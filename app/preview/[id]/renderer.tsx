"use client";

import { Progress } from "@/components/ui/progress";
import { useFFmpeg } from "../../lib/hooks";
import { Button } from "@/components/ui/button";
import { GeneratedContent } from "@/app/audio-provider";

export default function Renderer({ content }: { content: GeneratedContent }) {
  const [rendering, percentage, resURL, render] = useFFmpeg(content);

  return rendering ? (
    <>
      <div>
        <p className="mb-2 w-[100%] text-center">
          Rendering... do not close this page.
        </p>
        <Progress value={percentage} />
      </div>
    </>
  ) : (
    <>
      {resURL ? (
        <Button asChild>
          <a download="aita" href={resURL}>
            Download
          </a>
        </Button>
      ) : (
        <Button onClick={render}>Export</Button>
      )}
    </>
  );
}
