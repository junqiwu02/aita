import { lenSplit } from "@/app/lib/util";
import { Composition } from "./composition";
import Renderer from "./renderer";
import { fromSRT } from "@/app/lib/srt";
import { Player } from "@remotion/player";

export default async function Preview({ params }: { params: { id: string } }) {
  const fps = 30;
  const id = params.id;
  // fetch data using await
  const titleResponse = await fetch(`${process.env.BASE_URL}/subs/${id}_title.srt`);
  if (!titleResponse.ok) {
    throw new Error(`Error fetching /subs/${id}_title.srt`);
  }
  const titleItem = fromSRT(await titleResponse.text())[0];
  // santize and split the title into lines for ffmpeg
  const titleText = lenSplit(titleItem.text.replaceAll("'", ""), " ", 35).join("\n");
  const titleDuration = titleItem.end;

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
          component={Composition}
          inputProps={{ id: id, title: titleText, titleDuration: titleDuration, subs: subs }}
          durationInFrames={durationInFrames}
          compositionWidth={720}
          compositionHeight={1280}
          fps={fps}
          style={{ height: "75vh" }}
          controls
        />
        <div className="flex justify-center py-2">
          <Renderer id={id} title={titleText} titleDuration={titleDuration} />
        </div>
      </div>
    </>
  );
}
