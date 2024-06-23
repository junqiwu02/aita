"use client";

import { useFFmpeg } from "../lib/hooks";
import Progress from "./progress";

export default function Renderer({ id }: { id: string }) {
  const [rendering, percentage, resURL, render] = useFFmpeg(id);

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