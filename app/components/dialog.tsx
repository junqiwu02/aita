import { MouseEvent } from "react";
import Form from "./form";

export default function Dialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleContentClick = (e: MouseEvent<HTMLDivElement>) => {
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
            onClick={handleContentClick}
          >
            <div className="flex justify-between">
              <h2 className="p-1 font-bold">Generate Video 🎥</h2>
              <button
                className="rounded px-2 py-1 hover:text-neutral-300"
                onClick={handleClose}
              >
                x
              </button>
            </div>
            <Form />
          </div>
        </dialog>
      )}
    </>
  );
}
