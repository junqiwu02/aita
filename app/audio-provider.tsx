"use client";

import React, { createContext, useContext, useState } from "react";
import { SubItem } from "./lib/srt";

export type GeneratedContent = {
  title: SubItem;
  body: SubItem[];
  titleAudio: string;
  bodyAudio: string;
};

const AudioContext = createContext({
  content: {} as GeneratedContent,
  setContent: (content: GeneratedContent) => {},
});

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState({} as GeneratedContent);

  return (
    <AudioContext.Provider value={{ content, setContent }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};
