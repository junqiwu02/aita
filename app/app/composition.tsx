"use client";

import { useContent } from "@/app/content-provider";
import { useMemo } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";

export const Composition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { title, body, titleAudio, bodyAudio } = useContent();

  const audioURL = useMemo(() => {
    return "data:audio/wav;base64," + titleAudio + bodyAudio;
  }, [titleAudio, bodyAudio]);

  const t = frame / fps;
  const titleText = t <= title.timestamp[1] ? title.text : "";
  const subText =
    body.find((item) => t >= item.timestamp[0] && t <= item.timestamp[1])
      ?.text || "";

  const subStyle = {
    textShadow: `
      -4px -4px 0 #000,  
       4px -4px 0 #000,
      -4px  4px 0 #000,
       4px  4px 0 #000`,
  };

  return (
    <>
      <Audio src={audioURL}></Audio>
      <AbsoluteFill>
        <OffthreadVideo src="/minecraft0.mp4" muted></OffthreadVideo>
      </AbsoluteFill>
      <AbsoluteFill>
        <Img src="/title-card.png" hidden={titleText === ""}></Img>
      </AbsoluteFill>
      <AbsoluteFill className="justify-center">
        <h1
          className="font-montserrat pl-[75px] pt-[40px] text-[30px] font-extrabold leading-8 text-black"
          style={{ whiteSpace: "pre-line" }} // make \n line breaks
        >
          {titleText}
        </h1>
      </AbsoluteFill>
      <AbsoluteFill className="justify-center">
        <h1
          className="font-montserrat text-center text-[48px] font-extrabold"
          style={subStyle}
        >
          {subText}
        </h1>
      </AbsoluteFill>
    </>
  );
};
