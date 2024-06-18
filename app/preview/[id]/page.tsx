"use client";

import { MyComposition } from "@/app/components/Composition";
import { Player } from "@remotion/player";
import Link from "next/link";

export default function Preview({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="block">
        <Player
          component={MyComposition}
          inputProps={{ id: params.id }}
          durationInFrames={4500}
          compositionWidth={720}
          compositionHeight={1280}
          fps={30}
          style={{ height: "75vh" }}
          controls
        />
        <div className="flex justify-center py-2">
          <button className="mx-4 cursor-not-allowed rounded border bg-transparent px-4 py-2 font-bold hover:bg-neutral-700">
            Edit
          </button>
          <Link
            className="mx-4 rounded bg-indigo-500 px-4 py-2 font-bold shadow-lg hover:bg-indigo-700"
            href={`/gen/${params.id}`}
          >
            Export
          </Link>
        </div>
      </div>
    </>
  );
}
