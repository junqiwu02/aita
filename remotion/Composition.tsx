import { AbsoluteFill, OffthreadVideo, Audio, useCurrentFrame } from "remotion";

export const MyComposition = () => {
  const frame = useCurrentFrame();
    
  return (
    <>
      <Audio src={"/audios/output.mp3"}></Audio>
      <AbsoluteFill>
        <OffthreadVideo src={"/minecraft0.mp4"} muted></OffthreadVideo>
      </AbsoluteFill>
      <AbsoluteFill className="justify-center">
        <h1 className="text-center">Currently on frame {frame}</h1>
      </AbsoluteFill>
    </>
  )
};