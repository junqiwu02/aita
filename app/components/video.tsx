"use client";

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useRef, useState } from 'react';

export default function Video({ id }: { id: string }) {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);

  const load = async () => {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on('log', ({ message }) => {
          console.log(message);
      });
      // toBlobURL is used to bypass CORS issue, urls with the same domain can be used directly.
      await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setLoaded(true);
  }

  const mix = async() => {
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile('video.mp4', await fetchFile('/minecraft0.mp4'));
    await ffmpeg.writeFile('audio.mp3', await fetchFile('/audios/output.mp3'));
    await ffmpeg.writeFile('subs.srt', await fetchFile('/test.srt'));
    await ffmpeg.writeFile('tmp/arial.ttf', await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf'));
    await ffmpeg.exec(['-i', 'video.mp4', '-i', 'audio.mp3', '-c', 'copy', '-map', '0:v:0', '-map', '1:a:0', 'mixed.mp4']);
    await ffmpeg.exec(['-i', 'mixed.mp4', '-vf', `subtitles=subs.srt:fontsdir=/tmp:force_style='Alignment=10'`, '-preset', 'ultrafast', 'output.mp4']);
    const data = await ffmpeg.readFile('output.mp4');
    videoRef.current.src =
        URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
  }

  return (loaded
    ? (
        <>
            <video ref={videoRef} controls></video><br/>
            <button onClick={mix}>Add audio</button>
        </>
    )
    : (
        <button onClick={load}>Load ffmpeg-core (~31 MB)</button>
    )
);

  // return (
  //   <>
  //     <video src="/minecraft0.mp4" controls></video>
  //     <audio src={`/audios/${id}.mp3`} controls></audio>
  //   </>
  // );
}
