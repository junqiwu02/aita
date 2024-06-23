"use client";

import { useFFmpeg } from "../../lib/hooks";
import Progress from "../../components/progress";

export default function Renderer({ id, title, titleDuration }: { id: string, title: string, titleDuration: number }) {
  const [rendering, percentage, resURL, render] = useFFmpeg(id, title, titleDuration);

  return rendering ? (
    <>
      <div>
        <p className="mb-2 w-[100%] text-center">
          Rendering your video, do not leave this page.
        </p>
        <Progress percentage={percentage} />
      </div>
    </>
  ) : (
    <>
      {resURL ? (
        <a
          className="mx-4 rounded bg-indigo-500 px-4 py-2 font-bold shadow-lg hover:bg-indigo-700"
          download="aita"
          href={resURL}
        >
          Download
        </a>
      ) : (
        <button
          className="rounded bg-indigo-500 px-4 py-2 font-bold shadow-lg hover:bg-indigo-700"
          onClick={render}
        >
          Render
        </button>
      )}
    </>
  );
}
