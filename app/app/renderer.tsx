"use client";

import { Progress } from "@/components/ui/progress";
import { useFFmpeg } from "../lib/hooks";
import { Button } from "@/components/ui/button";

export default function Renderer() {
  const [rendering, percentage, resURL, render] = useFFmpeg();

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
