"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";

export default function Video({ id }: { id: string }) {
  const [loaded, setLoaded] = useState(false);
  const [mixed, setMixed] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  const generate = async () => {
    console.log('Staring render...')
    const ffmpeg = ffmpegRef.current;
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
    ffmpeg.on('log', ({ message }) => {
      console.log(message);
  });
    // toBlobURL is used to bypass CORS issue, urls with the same domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm",
      ),
    });
    
    setLoaded(true);
    
    await ffmpeg.writeFile("video.mp4", await fetchFile("/minecraft0.mp4"));
    await ffmpeg.writeFile("audio.mp3", await fetchFile("/audios/output.mp3"));
    // await ffmpeg.writeFile('subs.srt', await fetchFile('/test.srt'));
    await ffmpeg.writeFile("subs.ass", await fetchFile("/subs/output.ass"));
    await ffmpeg.writeFile(
      "tmp/font.ttf",
      await fetchFile(
        "/Montserrat-ExtraBold.ttf",
      ),
    );
    await ffmpeg.exec([
      "-i",
      "video.mp4",
      "-i",
      "audio.mp3",
      "-c",
      "copy",
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-shortest",
      "mixed.mp4",
    ]);

    ffmpeg.on("progress", ({ progress, time }) => {
      let percentage = Math.floor(progress * 100);
      progressRef.current.innerHTML = `Progress: ${percentage}%`;
      console.log(`Progress: ${percentage}%`);
    });
    
    await ffmpeg.exec([
      "-i",
      "mixed.mp4",
      "-vf",
      `ass=subs.ass:fontsdir=/tmp`,
      "-preset",
      "ultrafast",
      "output.mp4",
    ]);
    const data = await ffmpeg.readFile("output.mp4");
    videoRef.current.src = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" }),
    );

    setMixed(true);
  };


  useEffect(() => {
    const ffmpeg = ffmpegRef.current;
    return () => {
      // stop any running commands if the component unmounts
      ffmpeg.terminate();
    }
  }, []);

  return (
    <>
      <button className="rounded bg-indigo-500 px-4 py-2 font-bold shadow-lg hover:bg-indigo-700" onClick={generate} hidden={loaded}>Render!</button>
      <p ref={progressRef} hidden={!loaded || mixed}>Progress: 0%</p>
      <video className="h-[75vh] w-auto" ref={videoRef} hidden={!loaded || !mixed} controls></video>
    </>
  );
}
