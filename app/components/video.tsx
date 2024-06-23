"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";
import Progress from "./progress";
import { SubItem, fromSRT } from "../lib/srt";
import { lenSplit } from "../lib/util";

export default function Video({ id }: { id: string }) {
  const [loaded, setLoaded] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [videoSrc, setVideoSrc] = useState("");
  const ffmpegRef = useRef(new FFmpeg());
  const [title, setTitle] = useState<SubItem>();

  const generate = async () => {
    setLoaded(true);

    const ffmpeg = ffmpegRef.current;
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
    ffmpeg.on("log", ({ message }) => {
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

    await ffmpeg.writeFile("video.mp4", await fetchFile("/test.mp4"));
    await ffmpeg.writeFile("audio.mp3", await fetchFile("/audios/output.mp3"));
    await ffmpeg.writeFile("subs.srt", await fetchFile("/subs/output.srt"));
    await ffmpeg.writeFile(
      "tmp/font.ttf",
      await fetchFile("/Montserrat-ExtraBold.ttf"),
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
      setPercentage(Math.floor(progress * 100));
    });

    await ffmpeg.writeFile("title.srt", await fetchFile("/subs/output_title.srt"));
    await ffmpeg.writeFile("title-card.png", await fetchFile("/title-card.png"));
    const titleDuration = title?.end || 0;
    const titleText = title?.text.replaceAll("'", "") || "";
    // split the title into multiple lines for formatting
    const titleWithBreaks = lenSplit(titleText, " ", 35).join("\n");

    await ffmpeg.exec([
      "-i",
      "mixed.mp4",
      "-i",
      "title-card.png",
      "-filter_complex",
      "[1][0]scale2ref[title][video];" + // scale title to video
      `[video][title]overlay=0:0:enable='lt(t,${titleDuration})'[titled];` + // overlay for titleDuration seconds
      `[titled]drawtext=text='${titleWithBreaks}'` + // title as drawtext since subs don't have easy customization of line and vertical spacing
      ":fontfile=/tmp/font.ttf" +
      ":fontsize=20" + 
      ":y=(h-text_h)/2+15" + 
      ":x=50" +
      `:enable='lt(t,${titleDuration})'[sub1];` +
      "[sub1]subtitles=subs.srt" + // body subs
      ":fontsdir=/tmp" +
      ":force_style='Fontname=Montserrat ExtraBold,Alignment=10'",
      "-preset",
      "ultrafast",
      "output.mp4"
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    setVideoSrc(URL.createObjectURL(new Blob([data], { type: "video/mp4" })));

    setRendered(true);
  };

  useEffect(() => {
    const fetchTitle = async () => {
      const titleResponse = await fetch(`/subs/${id}_title.srt`);
      if (!titleResponse.ok) {
        throw new Error(`Error fetching /subs/${id}_title.srt`);
      }
      const title = await titleResponse.text();
      setTitle(fromSRT(title)[0]);
    }

    fetchTitle();
  }, [id]);

  useEffect(() => {
    const ffmpeg = ffmpegRef.current;
    return () => {
      // stop any running commands if the component unmounts
      ffmpeg.terminate();
    };
  }, []);

  return loaded ? (
    <>
      <div hidden={rendered}>
        <p className="my-4 w-[100%] text-center">Rendering your video, do not leave this page.</p>
        <Progress percentage={percentage} />
      </div>
      <video
        className="h-[75vh] w-auto"
        src={videoSrc}
        hidden={!rendered}
        controls
      ></video>
    </>
  ) : (
    <>
      <div className="my-8 w-[100%] text-center">
        <h1 className="text-3xl font-bold">Your video is ready!</h1>
      </div>
      <div>
        <button
          className="rounded bg-indigo-500 px-4 py-2 font-bold shadow-lg hover:bg-indigo-700"
          onClick={generate}
        >
          Render
        </button>
      </div>
    </>
  );
}
