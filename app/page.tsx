"use client";

import { useState } from "react";
// import Dialog from "./dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Form from "./form";

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

      {/* <button
        className="rounded bg-indigo-500 px-4 py-2 font-bold shadow-lg hover:bg-indigo-700"
        onClick={handleClick}
      >
        Let&apos;s Go!
      </button> */}
      {/* <Dialog isOpen={isOpen} setIsOpen={setIsOpen} /> */}
      <Dialog>
        <Button asChild>
          <DialogTrigger>Let&apos;s Go!</DialogTrigger>
        </Button>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Video 🎥</DialogTitle>
            <DialogDescription>
              <Form></Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
