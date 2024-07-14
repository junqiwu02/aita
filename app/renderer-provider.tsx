"use client";

import React, { createContext, useCallback, useContext } from "react";
import { useFFmpeg, useTranscriber } from "./lib/hooks";
import { SubItem } from "./lib/srt";

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
  const [transcriptionPercentage, transcribe] = useTranscriber();
  const [rendering, renderPercentage, resURL, render] = useFFmpeg();
  const progress = Math.floor(
    0.5 * transcriptionPercentage + 0.5 * renderPercentage,
  );

  const run = useCallback(async (title: SubItem, body: SubItem[], titleAudio: string, bodyAudio: string) => {
    await transcribe(bodyAudio);
    await render(title, body, titleAudio, bodyAudio);
  }, [transcribe, render]);

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
