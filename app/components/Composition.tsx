import { SubItem, fromSRT } from "@/app/lib/srt";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Audio,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const MyComposition = ({ id }: { id: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [subs, setSubs] = useState<SubItem[]>([]);

  // find the subtitle that should be active
  const t = frame / fps;
  // is it possible to do this with binary search?
  const activeSub = subs.find((item) => t >= item.start && t <= item.end);

  useEffect(() => {
    const fetchSubs = async () => {
      const response = await fetch(`/subs/${id}.srt`);

      if (!response.ok) {
        throw new Error(`Error fetching /subs/${id}.srt`);
      }

      const srt = await response.text();
      setSubs(fromSRT(srt));
    };

    fetchSubs();
  }, [id]);

  const textStyle = {
    textShadow: `
      -4px -4px 0 #000,  
       4px -4px 0 #000,
      -4px  4px 0 #000,
       4px  4px 0 #000` // Combination of shadows to create outline
  };

  return (
    <>
      <Audio src={`/audios/${id}.mp3`}></Audio>
      <AbsoluteFill>
        <OffthreadVideo src={"/minecraft0.mp4"} muted></OffthreadVideo>
      </AbsoluteFill>
      <AbsoluteFill className="justify-center">
        <h1 className="text-center font-montserrat text-[48px] font-extrabold" style={textStyle}>
          {activeSub?.text || ""}
        </h1>
      </AbsoluteFill>
    </>
  );
};
