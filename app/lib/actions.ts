"use server";

import { promises as fs } from "fs";
import { redirect } from "next/navigation";
import { fetchGroq, fetchTTS } from "./fetches";
import { forceAlign, toSRT } from "./srt";

const MALE_SPEAKER = "en_us_006";
const FEMALE_SPEAKER = "en_us_001";
const CPS = 21400; // base64 encoded chars per second of audio

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


  const items = forceAlign(batches, encoded_voices.map((str) => str.length / CPS));
  const srt = toSRT(items);
  // console.log(
  //   `Estimated audio duration at ${srt.split("\n").at(-1)?.slice(23, 33)}`,
  // );
  console.log(`Writing to ${fileName}.srt`);
  await fs.writeFile(`./public/subs/${fileName}.srt`, srt);

  redirect(`/gen/${fileName}`);
}
