import Groq from "groq-sdk";


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function fetchGroq(prompt: string) : Promise<string> {
  const chat = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-8b-8192",
  });

  return chat.choices[0]?.message?.content || "Groq Error";
}


const TIKTOK_BASE_URL =
  "https://api16-normal-useast5.us.tiktokv.com/media/api/text/speech/invoke";

export async function fetchTTS(text: string, speaker: string): Promise<string> {
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

  for (let attempts = 0; attempts < 5; attempts++) {
    try {
      // fetch with 5s timeout
      const res = await fetch(URL, {
        method: "POST",
        headers: headers,
        signal: AbortSignal.timeout(3000),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = await res.json();
  
      if (data?.status_code !== 0) {
        throw new Error(`Tiktok Error: ${data?.status_msg}`);
      }
    
      const encoded_voice = data?.data?.v_str;
    
      return encoded_voice;
    } catch (e) {
      console.log(e);
      console.log('Retrying...');
    }
  }

  console.log("Out of retries.");
  return "";
}