"use server";

import { promises as fs } from "fs";
import { redirect } from "next/navigation";
import { fetchGroq, fetchTTS } from "./fetches";

const MALE_SPEAKER = "en_us_006";
const FEMALE_SPEAKER = "en_us_001";
const CPS = 21400; // base64 encoded chars per second of audio

function ass(batches: string[], encodedLens: number[]) {
  const header = `[Script Info]
Title: Transcript
ScriptType: v4.00+
Collisions: Normal
PlayDepth: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Montserrat ExtraBold,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,2,2,5,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  function toAssTime(t: number) {
    const hr = Math.floor(t / 3600);
    const min = Math.floor((t % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    const centisec = Math.floor((t * 100) % 100)
      .toString()
      .padStart(2, "0");
    return `${hr}:${min}:${sec}.${centisec}`;
  }

  function heuristic(word: string) {
    let dur = 1;
    dur += word.length * 0.1;
    dur += /[,.!?]/.test(word) ? 1.5 : 0;
    return dur;
  }

  const dialogues: string[] = [];
  let currTime = 0;

  for (let i = 0; i < batches.length; i++) {
    // split batch into individual tokens and calc duration in seconds of each token
    const totalDuration = encodedLens[i] / CPS;
    const tokens = batches[i].split(" ");
    let durations = tokens.map((str) => heuristic(str));
    // normalize to sum to totalDuration
    const norm = totalDuration / durations.reduce((sum, x) => sum + x);
    durations = durations.map((dur) => norm * dur);

    tokens.forEach((text, j) => {
      const start = toAssTime(currTime);
      const end = toAssTime(currTime + durations[j]);
      currTime += durations[j];
      dialogues.push(`Dialogue: 0,${start},${end},Default,,0,0,0,,${text}`);
    });
  }

  return header + dialogues.join("\n");
}

export async function generate(formData: FormData) {
  const title = formData.get("title");
  const titlePrompt = title ? ` with the title ${title}` : "";
  const speaker =
    formData.get("speaker") === "female" ? FEMALE_SPEAKER : MALE_SPEAKER;
  const include = formData.getAll("include");
  const tldr = include.includes("tldr") ? "Include a TL;DR at the bottom of the post. " : "";
  const update = include.includes("update") ? "Include an update at the bottom of the post that continues the story. " : "";
  const content =
    `Generate a Reddit story in the form of a r/AmItheAsshole post${titlePrompt}. ` +
    `The story should be engaging, juicy, and full of drama. ` +
    `Do not use asterisks or dashes for formating. ` +
    `Include the title as the first line of the response. ` +
    `${tldr}${update}`;
    
  console.log(`Prompting groq with:\n${content}`);
  const rawText = await fetchGroq(content);
  const text = rawText.replace(/\n+/g, " "); // convert newlines into spaces for better tts
  console.log(`Received response from Groq:\n${rawText}`);

  // Break the text into smaller batches since the api rejects long texts
  const maxLen = 200;
  const delim = ",.!?:";
  const batches = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + maxLen, text.length);
    while (start < end - 1 && !delim.includes(text[end - 1])) {
      end -= 1;
    }
    if (start === end - 1) {
      // no delim found, just take entire section
      end = Math.min(start + maxLen, text.length);
    }
    batches.push(text.slice(start, end).trim());
    start = end;
  }

  console.log(
    `Fetching TikTok API with batches of len [${batches.map((str) => str.length)}]`,
  );
  const encoded_voices = await Promise.all(
    batches.map((text) => fetchTTS(text, speaker)),
  );
  const encoded_voice = encoded_voices.join("");

  const fileName = "output";
  console.log(`Writing ${encoded_voice.length} chars to ${fileName}.mp3`);
  await fs.writeFile(
    `./public/audios/${fileName}.mp3`,
    Buffer.from(encoded_voice, "base64"),
  );

  const subs = ass(
    batches,
    encoded_voices.map((str) => str.length),
  );
  console.log(
    `Estimated audio duration at ${subs.split("\n").at(-1)?.slice(23, 33)}`,
  );
  console.log(`Writing to ${fileName}.ass`);
  await fs.writeFile(`./public/subs/${fileName}.ass`, Buffer.from(subs));

  redirect(`/gen/${fileName}`);
}
