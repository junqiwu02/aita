"use client";

import React, { createContext, useCallback, useContext } from "react";
import { useFFmpeg } from "../lib/hooks";
import { SubItem } from "../lib/srt";

const RendererContext = createContext({
  progress: 0,
  resURL: "",
  run: (title: SubItem, body: SubItem[], titleAudio: string, bodyAudio: string) => {},
});

export const RendererProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const [transcriptionPercentage, transcribe] = useTranscriber();
  const [rendering, renderPercentage, resURL, render] = useFFmpeg();
  // const progress = Math.floor(
  //   0.5 * transcriptionPercentage + 0.5 * renderPercentage,
  // );
  const progress = renderPercentage;

  // const run = useCallback(async (title: SubItem, body: SubItem[], titleAudio: string, bodyAudio: string) => {
  //   const transcript = await transcribe(bodyAudio);
  //   await render(title, transcript, titleAudio, bodyAudio);
  // }, [transcribe, render]);
  const run = useCallback(async (title: SubItem, body: SubItem[], titleAudio: string, bodyAudio: string) => {
    await render(title, body, titleAudio, bodyAudio);
  }, [render]);

  return (
    <RendererContext.Provider value={{ progress, resURL, run }}>
      {children}
    </RendererContext.Provider>
  );
};

export const useRenderer = () => {
  const context = useContext(RendererContext);
  if (context === undefined) {
    throw new Error("useRenderer must be used within a RendererProvider");
  }
  return context;
};
