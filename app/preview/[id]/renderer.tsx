"use client";

import { Progress } from "@/components/ui/progress";
import { useFFmpeg } from "../../lib/hooks";
import { Button } from "@/components/ui/button";

export default function Renderer({
  id,
  title,
  titleDuration,
}: {
  id: string;
  title: string;
  titleDuration: number;
}) {
  const [rendering, percentage, resURL, render] = useFFmpeg(
    id,
    title,
    titleDuration,
  );

  return rendering ? (
    <>
      <div>
        <p className="mb-2 w-[100%] text-center">
          Rendering... do not leave this page.
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
