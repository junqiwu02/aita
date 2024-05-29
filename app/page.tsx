import Dialog from "./components/dialog";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-xl flex-wrap justify-center align-middle">
      <div className="my-[64px] text-center">
        <h1 className="text-7xl font-bold">AI Generated Reddit Stories</h1>
      </div>

      <Dialog />
    </main>
  );
}
