"use server";

import Groq from "groq-sdk";
import { promises as fs } from "fs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const TIKTOK_BASE_URL =
  "https://api16-normal-useast5.us.tiktokv.com/media/api/text/speech/invoke";
const MALE_SPEAKER = "en_us_006";

async function tts(text: string): Promise<string> {
  // prepare text for url param
  text = text.replace("+", "plus");
  text = text.replace(/\s/g, "+");
  text = text.replace("&", "and");

  const URL = `${TIKTOK_BASE_URL}/?text_speaker=${MALE_SPEAKER}&req_text=${text}&speaker_map_type=0&aid=1233`;
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

export async function generate(formData: FormData) {
  const title = formData.get("title");
  const chat = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Generate a Reddit story in the form of a r/AmItheAsshole post with the title ${title}. Include the title without any formatting as the first line of the response.`,
      },
    ],
    model: "llama3-8b-8192",
  });

  const text = chat.choices[0]?.message?.content || "Groq Error";
  console.log(`Received response from Groq:\n${text}`);

  // Break the text into smaller batches
  const max_batch_size = 300;
  const delim = ",.!?:";
  const batches = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + max_batch_size, text.length - 1);
    while (start < end && !delim.includes(text[end])) {
      end -= 1;
    }
    if (start === end) {
      // no delim found, just take entire section
      end = Math.min(start + max_batch_size, text.length - 1);
    }
    batches.push(text.slice(start, end + 1).trim());
    start = end + 1;
  }

  console.log(`Split text into batches of length [${batches.map((str) => str.length)}]`);
  console.log("Fetching TikTok API...");
  const encoded_voice = (await Promise.all(batches.map(tts))).join('');
  
  const fileName = batches[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, 30);
  console.log(`Writing to ${fileName}.mp3`);
  await fs.writeFile(`./public/audios/${fileName}.mp3`, Buffer.from(encoded_voice, "base64"));

  console.log("Done!");
}
