import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useCallback, useEffect, useRef, useState } from "react";
import { SubItem, toSRT } from "./srt";
import { useContent } from "@/app/providers/content-provider";

export function useFFmpeg(): [boolean, number, string, (title: SubItem, body: SubItem[], titleAudio: string, bodyAudio: string) => Promise<string>] {
  const [rendering, setRendering] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [resURL, setResURL] = useState("");
  const ffmpegRef = useRef(new FFmpeg());

  const ffmpeg = ffmpegRef.current;
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

  const render = async (title: SubItem, body: SubItem[], titleAudio: string, bodyAudio: string) => {
    setRendering(true);
    setPercentage(0);

    // ffmpeg.on("log", ({ message }) => {
    //   console.log(message);
    // });

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
    await ffmpeg.writeFile("audio.mp3", Buffer.from(titleAudio + bodyAudio, "base64"));
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

    await ffmpeg.writeFile(
      "title-card.png",
      await fetchFile("/title-card.png"),
    );
    await ffmpeg.writeFile(
      "tmp/font.ttf",
      await fetchFile("/Montserrat-ExtraBold.ttf"),
    );
    // await ffmpeg.writeFile("subs.srt", await fetchFile("/subs/output.srt"));
    const srt = toSRT(body);
    await ffmpeg.writeFile("subs.srt", srt);

    await ffmpeg.exec([
      "-i",
      "mixed.mp4",
      "-i",
      "title-card.png",
      "-filter_complex",
      "[1][0]scale2ref[title][video];" + // scale title to video
        `[video][title]overlay=0:0:enable='lt(t,${title.timestamp[1]})'[titled];` + // overlay for titleDuration seconds
        `[titled]drawtext=text='${title.text}':` + // title as drawtext since subs don't have easy customization of line and vertical spacing
        "fontfile=/tmp/font.ttf:" +
        "fontsize=20:" +
        "y=(h-text_h)/2+15:" +
        "x=50:" +
        `enable='lt(t,${title.timestamp[1]})'[sub1];` +
        "[sub1]subtitles=subs.srt:" + // body subs
        "fontsdir=/tmp:" +
        "force_style='Fontname=Montserrat ExtraBold,Alignment=10'",
      "-preset",
      "ultrafast",
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");
    const downloadURL = URL.createObjectURL(new Blob([data], { type: "video/mp4" }))
    setResURL(downloadURL);

    setRendering(false);

    return downloadURL;
  };

  useEffect(() => {
    return () => {
      ffmpeg.terminate(); // stop any running commands if the component unmounts
    };
  }, [ffmpeg]);

  return [rendering, percentage, resURL, render];
}

/**
 * @deprecated
 */
export function useTranscriber(): [number, (audioData: string) => Promise<SubItem[]>] {
  const [percentage, setPercentage] = useState(0);
  const { title, setBody } = useContent();

  // Create a reference to the worker object.
  const worker = useRef<Worker | null>(null);

  // We use the `useEffect` hook to set up the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL("./worker.js", import.meta.url), {
        type: "module",
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e: MessageEvent) => {
      const message = e.data;
      console.log(`Received message from worker: ${message.status}`);
      switch (message.status) {
        case "initiate":
          setPercentage(5);
          break;
        case "ready":
          setPercentage(10);
          break;
        case "update":
          setPercentage(Math.min(90, percentage + 10));
          break;
        case "complete":
          // delay every word in the transcript by the title duration
          const transcript: SubItem[] = message.data.chunks;
          const offset = title.timestamp[1];
          for (const item of transcript) {
            item.timestamp[0] += offset;
            item.timestamp[1] += offset;
          }
          setBody(transcript);
          setPercentage(100);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener("message", onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () =>
      worker.current?.removeEventListener("message", onMessageReceived);
  });

  const transcribe = useCallback(async (audioData: string) => {
    function base64ToArrayBuffer(base64: string) {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }


    if (worker.current) {
      // webworkers do not support AudioContext, so we must decode the audio file first in the main thread
      const audioCTX = new window.AudioContext({
        sampleRate: 16000,
      });
      // const arrayBuffer = await bodyAudio.arrayBuffer();
      const decoded = await audioCTX.decodeAudioData(base64ToArrayBuffer(audioData));
      const audio = decoded.getChannelData(0);

      worker.current.postMessage({ audio });

      // wait for the worker to finish before returning
      const transcript: SubItem[] = await new Promise((resolve, reject) => {
        worker.current?.addEventListener("message", (e: MessageEvent) => {
          if (e.data.status === "complete") {
            resolve(e.data.data.chunks);
          }
        });
      });

      return transcript;
    }

    return [];
  }, []);

  return [percentage, transcribe];
}
