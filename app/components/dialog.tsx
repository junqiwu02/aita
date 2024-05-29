"use client";

import { MouseEvent, useState } from "react";
import Form from "./form";

export default function Dialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDialogClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      {isOpen && (
        <dialog
          className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-0 backdrop-blur"
          onClick={handleClose}
        >
          <div
            className="rounded bg-neutral-800 p-4 text-white shadow-lg"
            onClick={handleDialogClick}
          >
            <div className="flex justify-between">
              <h2 className="p-1 font-bold">Generate Video 🎥</h2>
              <button
                className="rounded py-1 px-2 hover:text-neutral-300"
                onClick={handleClose}
              >
                x
              </button>
            </div>
            <Form />
          </div>
        </dialog>
      )}

      <button
        className="rounded bg-indigo-500 px-4 py-2 font-bold shadow-lg hover:bg-indigo-700"
        onClick={handleClick}
      >
        Let&apos;s Go!
      </button>
    </>
  );
}
