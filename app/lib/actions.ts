"use server";

import { promises as fs } from "fs";
import { redirect } from "next/navigation";
import { fetchGroq, fetchTTS } from "./fetches";
import { forceAlign, toSRT } from "./srt";

const MALE_SPEAKER = "en_us_006";
const FEMALE_SPEAKER = "en_us_001";
const CPS = 21400; // base64 encoded chars per second of audio

export async function generate(formData: FormData) {
  const userTitle = formData.get("title");
  const titlePrompt = userTitle ? ` with the title ${userTitle}` : "";
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
  console.log(`Received response from Groq:\n${rawText}`);

  const pgraphs = rawText.split("\n");
  const title = pgraphs[0]; // first line is the title
  const body = pgraphs.slice(1).join(" "); // convert newlines into spaces for better tts

  // Break the body into smaller batches since the api rejects long texts
  const maxLen = 200;
  const delim = ",.!?:";
  const batches = [title];
  let start = 0;
  while (start < body.length) {
    let end = Math.min(start + maxLen, body.length);
    while (start < end - 1 && !delim.includes(body[end - 1])) {
      end -= 1;
    }
    if (start === end - 1) {
      // no delim found, just take entire section
      end = Math.min(start + maxLen, body.length);
    }
    batches.push(body.slice(start, end).trim());
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

  // generate srt file for just the title
  const titleTime = encoded_voices[0].length / CPS
  const titleItem = { id: 0, start: 0, end: titleTime, text: title };
  const titleSrt = toSRT([titleItem]);
  console.log(`Writing to ${fileName}.srt`);
  await fs.writeFile(`./public/subs/${fileName}_title.srt`, titleSrt);

  const items = forceAlign(batches.slice(1), encoded_voices.slice(1).map((str) => str.length / CPS), titleTime);
  const srt = toSRT(items);
  console.log(`Writing to ${fileName}.srt`);
  await fs.writeFile(`./public/subs/${fileName}.srt`, srt);

  redirect(`/preview/${fileName}`);
}
