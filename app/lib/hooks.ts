import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useCallback, useEffect, useRef, useState } from "react";

export function useFFmpeg(id: string, title: string, titleDuration: number): [boolean, number, string, (() => Promise<void>)] {
  const [rendering, setRendering] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [resURL, setResURL] = useState("");
  const ffmpegRef = useRef(new FFmpeg());

  const ffmpeg = ffmpegRef.current;
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

  const render = async () => {
    setRendering(true);

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

    // copy over audio
    await ffmpeg.writeFile("video.mp4", await fetchFile("/test.mp4"));
    await ffmpeg.writeFile("audio.mp3", await fetchFile(`/audios/${id}.mp3`));
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

    await ffmpeg.writeFile("title-card.png", await fetchFile("/title-card.png"));
    await ffmpeg.writeFile(
      "tmp/font.ttf",
      await fetchFile("/Montserrat-ExtraBold.ttf"),
    );
    await ffmpeg.writeFile("subs.srt", await fetchFile("/subs/output.srt"));

    await ffmpeg.exec([
      "-i",
      "mixed.mp4",
      "-i",
      "title-card.png",
      "-filter_complex",
      "[1][0]scale2ref[title][video];" + // scale title to video
      `[video][title]overlay=0:0:enable='lt(t,${titleDuration})'[titled];` + // overlay for titleDuration seconds
      `[titled]drawtext=text='${title}':` + // title as drawtext since subs don't have easy customization of line and vertical spacing
      "fontfile=/tmp/font.ttf:" +
      "fontsize=20:" + 
      "y=(h-text_h)/2+15:" + 
      "x=50:" +
      `enable='lt(t,${titleDuration})'[sub1];` +
      "[sub1]subtitles=subs.srt:" + // body subs
      "fontsdir=/tmp:" +
      "force_style='Fontname=Montserrat ExtraBold,Alignment=10'",
      "-preset",
      "ultrafast",
      "output.mp4"
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    setResURL(URL.createObjectURL(new Blob([data], { type: "video/mp4" })));

    setRendering(false);
  }

  useEffect(() => {
    return () => {
      ffmpeg.terminate(); // stop any running commands if the component unmounts
    };
  }, [ffmpeg]);

  return [rendering, percentage, resURL, render];
}

export function useTransformers() {
  const [running, setRunning] = useState(false);
  const [percentage, setPercentage] = useState(false);

  // Create a reference to the worker object.
  const worker = useRef<Worker | null>(null);

  // We use the `useEffect` hook to set up the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e: MessageEvent) => {
      console.log(`Received message from worker: ${e.data.status}`);
      switch (e.data.status) {
        case 'initiate':
          console.log(`Intitiated`);
          break;
        case 'ready':
          console.log(`Ready`)
          break;
        case 'complete':
          console.log(`Complete: ${JSON.stringify(e.data)}`);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current?.removeEventListener('message', onMessageReceived);
  });

  const transcribe = useCallback(async (text: string) => {
    if (worker.current) {
      console.log('posting message');

    // webworkers do not support AudioContext, so we must decode the audio file first in the main thread
    const audioCTX = new window.AudioContext({
        sampleRate: 16000
    });
    const arrayBuffer = await (await fetch(text)).arrayBuffer();
    const decoded = await audioCTX.decodeAudioData(arrayBuffer);
    console.log(`NUM CHANNELS: ${decoded.numberOfChannels}`);
    const audio = decoded.getChannelData(0);

    console.log(`AUDIO DATA: ${audio}`);

      worker.current.postMessage({ audio });
    }
  }, []);

  return [transcribe];
}