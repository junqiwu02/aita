"use client";

import { MouseEvent, useState } from "react";

export default function Generator() {
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

            <form className="space-y-5" action="">
              <div>
                <label className="block" htmlFor="title">
                  Title
                </label>
                <input
                  className="rounded p-2 shadow text-black"
                  type="text"
                  id="title"
                  placeholder="Am I [22M] the asshole for..."
                />
              </div>
              <div>
                <label className="block" htmlFor="">
                  Length
                </label>
                <label className="p-2"><input type="radio" name="length" />1-2min</label>
                <label className="p-2"><input type="radio" name="length" />2-5min</label>
                <label className="p-2"><input type="radio" name="length" />5min+</label>
              </div>
              <div>
                <button className="rounded bg-indigo-500 px-4 py-2 font-bold shadow-lg hover:bg-indigo-700">
                  Generate
                </button>
              </div>
            </form>
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
