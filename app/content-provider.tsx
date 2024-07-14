"use client";

import React, { createContext, useContext, useState } from "react";
import { SubItem } from "./lib/srt";

const ContentContext = createContext({
  title: {} as SubItem,
  setTitle: (title: SubItem) => {},
  body: [] as SubItem[],
  setBody: (body: SubItem[]) => {},
  titleAudio: "",
  setTitleAudio: (titleAudio: string) => {},
  bodyAudio: "",
  setBodyAudio: (bodyAudio: string) => {},
});

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = useState({} as SubItem);
  const [body, setBody] = useState([] as SubItem[]);
  const [titleAudio, setTitleAudio] = useState("");
  const [bodyAudio, setBodyAudio] = useState("");

  return (
    <ContentContext.Provider value={{ title, setTitle, body, setBody, titleAudio, setTitleAudio, bodyAudio, setBodyAudio }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};
