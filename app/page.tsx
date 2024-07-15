import StartOptions from "@/app/components/start-options";


export default function Home() {
  return (
    <>
      <div className="my-[64px] text-center">
        <h1 className="text-7xl font-extrabold">🩳 SHORTS.JS</h1>
        <h2 className="text-zinc-400 mt-2">Create TikTok-ready short videos with a single click</h2>
      </div>
      
      <StartOptions></StartOptions>
    </>
  );
}
