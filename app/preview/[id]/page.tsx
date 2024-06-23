import { PreviewComposition } from "@/app/components/preview";
import Renderer from "@/app/components/renderer";
import { fromSRT } from "@/app/lib/srt";
import { Player } from "@remotion/player";
import Link from "next/link";

export default async function Preview({ params }: { params: { id: string } }) {
  const fps = 30;
  const id = params.id;
  // fetch data using await
  const titleResponse = await fetch(`${process.env.BASE_URL}/subs/${id}_title.srt`);
  if (!titleResponse.ok) {
    throw new Error(`Error fetching /subs/${id}_title.srt`);
  }
  const title = fromSRT(await titleResponse.text())[0];

  const response = await fetch(`${process.env.BASE_URL}/subs/${id}.srt`);
  if (!response.ok) {
    throw new Error(`Error fetching /subs/${id}.srt`);
  }
  const subs = fromSRT(await response.text());

  const durationInFrames = Math.ceil((subs.at(-1)?.end || 0) * fps);

  return (
    <>
      <div className="block">
        <Player
          component={PreviewComposition}
          inputProps={{ id: id, title: title, subs: subs }}
          durationInFrames={durationInFrames}
          compositionWidth={720}
          compositionHeight={1280}
          fps={fps}
          style={{ height: "75vh" }}
          controls
        />
        {/* <div className="flex justify-center py-2">
          <button className="mx-4 cursor-not-allowed rounded border bg-transparent px-4 py-2 font-bold hover:bg-neutral-700">
            Edit
          </button>
          <Link
            className="mx-4 rounded bg-indigo-500 px-4 py-2 font-bold shadow-lg hover:bg-indigo-700"
            href={`/gen/${params.id}`}
          >
            Export
          </Link>
        </div> */}
        <div className="flex justify-center py-2">
          <Renderer id={id} />
        </div>
      </div>
    </>
  );
}
