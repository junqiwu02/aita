"use server";

import Groq from "groq-sdk";
import { promises as fs } from "fs";
import { redirect } from "next/navigation";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const TIKTOK_BASE_URL =
  "https://api16-normal-useast5.us.tiktokv.com/media/api/text/speech/invoke";
const MALE_SPEAKER = "en_us_006";
const FEMALE_SPEAKER = "en_us_001";

async function tts(text: string, speaker: string): Promise<string> {
  // prepare text for url param
  text = text.replace("+", "plus");
  text = text.replace(/\s/g, "+");
  text = text.replace("&", "and");

  const URL = `${TIKTOK_BASE_URL}/?text_speaker=${speaker}&req_text=${text}&speaker_map_type=0&aid=1233`;
  const headers = {
    "User-Agent":
      "com.zhiliaoapp.musically/2022600030 (Linux; U; Android 7.1.2; es_ES; SM-G988N; Build/NRD90M;tt-ok/3.12.13.1)",
    Cookie: `sessionid=${process.env.TIKTOK_SESSIONID}`,
    "Accept-Encoding": "gzip,deflate,compress",
  };

  const res = await fetch(URL, {
    method: "POST",
    headers: headers,
  });

  const data = await res.json();

  if (data?.status_code !== 0) {
    console.log(`Tiktok Error: ${data?.status_msg}`);
    return "";
  }

  const encoded_voice = data?.data?.v_str;

  return encoded_voice;
}

function ass(tokens: string[], durations: number[]) {
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
    const min = Math.floor((t % 3600) / 60).toString().padStart(2, '0');
    const sec = Math.floor(t % 60).toString().padStart(2, '0');
    const centisec = Math.floor((t * 100) % 100).toString().padStart(2, '0');
    return `${hr}:${min}:${sec}.${centisec}`;
  }

  const dialogues: string[] = [];
  let currTime = 0;
  tokens.forEach((text, i) => {
    const start = toAssTime(currTime);
    const end = toAssTime(currTime + durations[i]);
    currTime += durations[i];
    dialogues.push(`Dialogue: 0,${start},${end},Default,,0,0,0,,${text}`);
  });

  return header + dialogues.join('\n');
}

function align(batches: string[], totalDuration: number) {
  const tokens = batches.join(" ").split(" ");

  function heuristic(word: string) {
    let dur = 1;
    dur += word.length * 0.15;
    dur += (/[,.!?]/).test(word) ? 1.3 : 0;
    return dur;
  }

  let durations = tokens.map(str => heuristic(str));
  // normalize to sum to totalDuration
  const baseDuration = totalDuration / durations.reduce((acc, dur) => acc + dur);
  durations = durations.map(dur => baseDuration * dur);

  return ass(tokens, durations);
}

// Prod code below, just simulating generation for now
/*
export async function generate(formData: FormData) {
  const batches = ["Am I the asshole for liking Miffy? I'm a 22-year-old male and for some reason, I've always had a weird affection for Miffy.","Like, I love the little white rabbit with the cute little nose and floppy ears. I know it sounds weird, but I just find her adorable.","My friends and family always give me crap about it, saying I'm too old to be liking a kid's cartoon character, and that I should be ashamed of myself. But honestly, it doesn't bother me.","Miffy is just so cute and innocent, you know? And I like that she's a bit simple and doesn't try to be all fancy or complex.","Sometimes, I'll just sit there and watch old episodes of the anime or read the comics, and just feel... happy. It's weird, I know, but I love Miffy.","But the weird thing is, my girlfriend of two years doesn't think it's cool.","She's always making fun of me when I watch Miffy with her, saying I'm being immature and that I should focus on more \"grown-up\" things. And honestly, it's starting to get on my nerves.","I feel like I'm being judged for having a simple fondness for a children's character. Is it really that weird? AITA for loving Miffy as much as I do? Or am I just being a big dork?"];

  const subs = align(batches, 65);
  console.log(`Writing to output.ass`);
  await fs.writeFile(`./public/subs/output.ass`, Buffer.from(subs));

  redirect(`/gen/output`);
}
*/
// /*
export async function generate(formData: FormData) {
  const title = formData.get("title");
  const speaker =
    formData.get("speaker") === "male" ? MALE_SPEAKER : FEMALE_SPEAKER;
  const include = formData.getAll("include");
  const edit = include.includes("edit") ? " And add an edit to the bottom of the post." : "";
  const update = include.includes("update") ? " And add an update to the bottom of the post." : "";
  const content = `Generate a Reddit story in the form of a r/AmItheAsshole post with the title ${title}. Include the title as the first line of the response. Do not use asterisks or dashes for formating.${edit}${update}`;
  const chat = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: content,
      },
    ],
    model: "llama3-8b-8192",
  });

  const rawText = chat.choices[0]?.message?.content || "Groq Error";
  const text = rawText.replace(/\n+/g, ' '); // convert newlines into spaces for better tts
  console.log(`Received response from Groq:\n${text}`);

  // Break the text into smaller batches since the api rejects long texts
  const maxLen = 200;
  const delim = ".!?";
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
    `Split text into batches of length [${batches.map(str => str.length)}]`,
  );

  console.log("Fetching TikTok API...");
  const encoded_voice = (await Promise.all(batches.map(text => tts(text, speaker)))).join("");

  const fileName = "output";
  console.log(`Writing ${encoded_voice.length} chars to ${fileName}.mp3`);
  await fs.writeFile(
    `./public/audios/${fileName}.mp3`,
    Buffer.from(encoded_voice, "base64"),
  );

  const totalDuration = encoded_voice.length / 21400;
  console.log(`Estimated audio duration at ${totalDuration}s`);
  const subs = align(batches, totalDuration);
  console.log(`Writing to ${fileName}.ass`);
  await fs.writeFile(`./public/subs/${fileName}.ass`, Buffer.from(subs));

  redirect(`/gen/${fileName}`);
}
// */