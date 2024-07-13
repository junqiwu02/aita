"use client";

import React, { createContext, useContext, useState } from "react";
import { SubItem } from "./lib/srt";

const AudioContext = createContext({
  title: {} as SubItem,
  setTitle: (title: SubItem) => {},
  body: [] as SubItem[],
  setBody: (body: SubItem[]) => {},
  titleAudio: "",
  setTitleAudio: (titleAudio: string) => {},
  bodyAudio: "",
  setBodyAudio: (bodyAudio: string) => {},
});

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState({} as SubItem);
  const [body, setBody] = useState([] as SubItem[]);
  const [titleAudio, setTitleAudio] = useState("");
  const [bodyAudio, setBodyAudio] = useState("");

  return (
    <AudioContext.Provider value={{ title, setTitle, body, setBody, titleAudio, setTitleAudio, bodyAudio, setBodyAudio }}>
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
