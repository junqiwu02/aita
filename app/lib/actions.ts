"use server";

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generate(formData: FormData) {
  const title = formData.get('title');
  const chat = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Generate a Reddit story in the form of a r/AmItheAsshole post with the title ${title}. Include the title as the first line of the response.`,
      },
    ],
    model: "llama3-8b-8192",
  });
  console.log(chat.choices[0]?.message?.content || "");
}
