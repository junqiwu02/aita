"use client";

import { Chunk } from "@/app/lib/hooks";
import { SubItem } from "@/app/lib/srt";
import {
  AbsoluteFill,
  OffthreadVideo,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";

export const Composition = ({
  id,
  title,
  titleDuration,
  subs,
}: {
  id: string;
  title: string;
  titleDuration: number;
  // subs: SubItem[];
  subs: Chunk[];
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = frame / fps;

  const titleText = t <= titleDuration ? title : "";
  const subText =
    subs.find((item) => t >= item.timestamp[0] && item.timestamp[1] !== null && t <= item.timestamp[1])?.text || "";
  // const subText =
  //   subs.find((item) => t >= item.start && t <= item.end)?.text || "";

  const subStyle = {
    textShadow: `
      -4px -4px 0 #000,  
       4px -4px 0 #000,
      -4px  4px 0 #000,
       4px  4px 0 #000`, // Combination of shadows to create outline
  };

  return (
    <>
      <Audio src={`/audios/${id}.mp3`}></Audio>
      <AbsoluteFill>
        <OffthreadVideo src="/minecraft0.mp4" muted></OffthreadVideo>
      </AbsoluteFill>
      <AbsoluteFill>
        <Img src="/title-card.png" hidden={titleText === ""}></Img>
      </AbsoluteFill>
      <AbsoluteFill className="justify-center">
        <h1
          className="pl-[75px] pt-[40px] font-montserrat text-[30px] font-extrabold leading-8 text-black"
          style={{ whiteSpace: "pre-line" }} // make \n line breaks
        >
          {titleText}
        </h1>
      </AbsoluteFill>
      <AbsoluteFill className="justify-center">
        <h1
          className="text-center font-montserrat text-[48px] font-extrabold"
          style={subStyle}
        >
          {subText}
        </h1>
      </AbsoluteFill>
    </>
  );
};
