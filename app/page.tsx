import StartOptions from "@/app/components/start-options";

export default function Home() {
  return (
    <>
      <div className="text-center">
        <h1 className="mt-[64px] text-7xl font-extrabold">🩳 SHORTS.JS</h1>
        <h2 className="mt-2 text-zinc-400">
          Create TikTok-ready short videos with a single click
        </h2>
        <div className="mt-[64px]">
          <StartOptions></StartOptions>
        </div>
      </div>
    </>
  );
}
