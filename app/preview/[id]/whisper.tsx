"use client";

import { useTransformers } from "@/app/lib/hooks";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Whisper() {
  const [transcribe] = useTransformers();

  return (
    <>
      <Button onClick={() => {transcribe('/audios/output.mp3')}}>Transcribe</Button>
    </>
  );
}