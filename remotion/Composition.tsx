import { useEffect, useState } from "react";
import { AbsoluteFill, OffthreadVideo, Audio, useCurrentFrame } from "remotion";

export const MyComposition = ({ id }: { id: string}) => {
  const frame = useCurrentFrame();
  const [text, setText] = useState('');

  useEffect(() => {
    const getSubs = async () => {
      const response = await fetch(`/subs/${id}.ass`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const ass = await response.text()

      const parsed = fromASS(ass);
      const lines = [];
      for (let i = 0; i < parsed.timestamps.length; i++) {
        lines.push(parsed.timestamps[i] + parsed.texts[i]);
      }
      setText(lines.join(''));
    }

    // getSubs();
  }, [id])
    
  return (
    <>
      <Audio src={`/audios/${id}.mp3`}></Audio>
      <AbsoluteFill>
        <OffthreadVideo src={"/minecraft0.mp4"} muted></OffthreadVideo>
      </AbsoluteFill>
      <AbsoluteFill className="justify-center">
        <h1 className="text-center">{text}</h1>
      </AbsoluteFill>
    </>
  )
};