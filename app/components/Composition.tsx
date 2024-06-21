import { SubItem, fromSRT } from "@/app/lib/srt";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";

export const MyComposition = ({ id }: { id: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [title, setTitle] = useState<SubItem>();
  const [subs, setSubs] = useState<SubItem[]>([]);

  const t = frame / fps;

  const titleText =
    title && t >= title.start && t <= title.end ? title.text : "";
  const subText =
    subs.find((item) => t >= item.start && t <= item.end)?.text || "";

  useEffect(() => {
    const fetchSubs = async () => {
      const titleResponse = await fetch(`/subs/${id}_title.srt`);
      if (!titleResponse.ok) {
        throw new Error(`Error fetching /subs/${id}_title.srt`);
      }
      const title = await titleResponse.text();
      setTitle(fromSRT(title)[0]);

      const response = await fetch(`/subs/${id}.srt`);
      if (!response.ok) {
        throw new Error(`Error fetching /subs/${id}.srt`);
      }
      const srt = await response.text();
      setSubs(fromSRT(srt));
    };

    fetchSubs();
  }, [id]);

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
        <h1 className="px-20 pt-10 font-montserrat text-[32px] font-extrabold leading-8 text-black">
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
