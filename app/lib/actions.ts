"use server";

import Groq from "groq-sdk";
import { promises as fs } from "fs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const TIKTOK_BASE_URL = "https://api16-normal-useast5.us.tiktokv.com/media/api/text/speech/invoke";
const MALE_SPEAKER = "en_us_006";

async function tts(text: string, fileName: string) {
  // prepare text for url param
  text = text.replace('+', 'plus');
  text = text.replace(/\s/g, '+');
  text = text.replace('&', 'and');

  const URL = `${TIKTOK_BASE_URL}/?text_speaker=${MALE_SPEAKER}&req_text=${text}&speaker_map_type=0&aid=1233`;
  const headers = {
    'User-Agent': 'com.zhiliaoapp.musically/2022600030 (Linux; U; Android 7.1.2; es_ES; SM-G988N; Build/NRD90M;tt-ok/3.12.13.1)',
    'Cookie': `sessionid=${process.env.TIKTOK_SESSIONID}`,
    'Accept-Encoding': 'gzip,deflate,compress',
  };

  const res = await fetch(URL, {
    method: 'POST',
    headers: headers,
  });

  const data = await res.json();
  const status_code = data?.status_code;

  if (status_code !== 0) {
    console.log(`Error: status code ${status_code} from TikTok API`)
    return;
  }

  const encoded_voice = data?.data?.v_str;
  await fs.writeFile(`${fileName}.mp3`, Buffer.from(encoded_voice, 'base64'));
}

export async function generate(formData: FormData) {
  const title = formData.get('title');
  const chat = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Generate a Reddit story in the form of a r/AmItheAsshole post with the title ${title}. Include the title without any formatting as the first line of the response.`,
      },
    ],
    model: "llama3-8b-8192",
  });
  // console.log(chat.choices[0]?.message?.content || "");

  const text = chat.choices[0]?.message?.content?.slice(0, 300) || "Error";
  const fileName = `./public/audios/${text.replace(/[^a-zA-Z0-9]/g, '').slice(0, 50)}`;

  console.log(text);
  console.log('Fetching TikTok API...')
  await tts(text, fileName);
  console.log('Done!');
}
