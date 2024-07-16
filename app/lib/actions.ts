"use server";

import { promises as fs } from "fs";
import { fetchGroq, fetchTTS } from "./fetches";
import { forceAlign, SubItem } from "./srt";
import { lenSplit } from "./util";

const MALE_SPEAKER = "en_us_006";
const FEMALE_SPEAKER = "en_us_001";
const CPS = 21400; // base64 encoded chars per second of audio

export async function generate(formData: FormData): Promise<{title: SubItem, body: SubItem[], titleAudio: string, bodyAudio: string}> {
  // const userTitle = formData.get("title");
  // const titlePrompt = userTitle ? ` with the title """${userTitle}"""` : "";
  // const speaker =
  //   formData.get("speaker") === "female" ? FEMALE_SPEAKER : MALE_SPEAKER;
  // const include = formData.getAll("include");
  // const tldr = include.includes("tldr") ? "Include a TL;DR at the bottom of the post. " : "";
  // const update = include.includes("update") ? "Include an update at the bottom of the post that continues the story. " : "";
  // const content =
  //   `Generate a Reddit story in the form of a r/AmItheAsshole post${titlePrompt}. ` +
  //   `The story should be engaging, juicy, and full of drama. ` +
  //   `Do not use asterisks or dashes for formating. ` +
  //   `Include the title as the first line of the response. ` +
  //   `${tldr}${update}`;
    
  // console.log(`Prompting groq with:\n${content}\n\n`);
  // const rawText = await fetchGroq(content);
  // console.log(`Received response from Groq:\n${rawText}\n\n`);

  // const pgraphs = rawText.split("\n");
  // const title = pgraphs[0]; // first line is the title
  // const body = pgraphs.slice(1).join(" "); // convert newlines into spaces for better tts

  // // Break the body into smaller batches since the api rejects long texts
  // const batches = lenSplit(body, ",.!?:", 200);
  // console.log(
  //   `Fetching TikTok API with batches of len [${batches.map((str) => str.length)}]`,
  // );
  // const titleAudio = await fetchTTS(title, speaker);
  // const bodyAudios = await Promise.all(
  //   batches.map((text) => fetchTTS(text, speaker)),
  // );
  // const combinedBodyAudio = bodyAudios.join("");
  
  // // sanitize title for ffmpeg
  // const sanitizedTitle = lenSplit(title.replace(/[':]/g, ""), " ", 35).join("\n");

  // const titleTime = titleAudio.length / CPS;
  // const titleItem: SubItem = { text: sanitizedTitle, timestamp: [0, titleTime] };
  // const bodyItems = forceAlign(batches, bodyAudios.map((str) => str.length / CPS), titleTime);

  // const res = { title: titleItem, body: bodyItems, titleAudio: titleAudio, bodyAudio: combinedBodyAudio };

  // await fs.writeFile('./public/test.json', JSON.stringify(res));
  const res = JSON.parse((await fs.readFile('./public/test.json')).toString());

  return res;
}
