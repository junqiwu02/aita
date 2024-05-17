import Image from "next/image";
import Generator from "./components/generator";


export default function Home() {

  return (
    <main className="flex flex-wrap justify-center align-middle max-w-xl mx-auto">
      {/* Hero */}
      <div className="my-[64px] text-center">
        <h1 className="font-bold text-7xl">AI Generated Reddit Stories</h1>
      </div>
      
      <Generator />
    </main>
  );
}
