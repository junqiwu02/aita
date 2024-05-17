"use client"

import { useState } from "react";


export default function Generator() {

  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {
        isOpen &&
        <dialog className="flex justify-center items-center fixed left-0 top-0 w-full h-full bg-black bg-opacity-0 backdrop-blur" onClick={handleClose}>
          <div className="bg-neutral-700 py-20 px-10 rounded">
            <p className="text-white">Hello👋</p>
          </div>
        </dialog>
      }

      <button className="bg-indigo-500 hover:bg-indigo-700 font-bold py-2 px-4 rounded" onClick={handleClick}>Generate</button>
    </>
  )
}