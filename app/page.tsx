"use client";

import { useState } from "react";
import Dialog from "./components/dialog";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="my-[64px] text-center">
        <h1 className="text-7xl font-bold">AI Generated Reddit Stories</h1>
      </div>

      <button
        className="rounded bg-indigo-500 px-4 py-2 font-bold shadow-lg hover:bg-indigo-700"
        onClick={handleClick}
      >
        Let&apos;s Go!
      </button>
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
