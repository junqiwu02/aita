import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/app/components/nav";
import { ContentProvider } from "@/app/providers/content-provider";
import { RendererProvider } from "@/app/providers/renderer-provider";
import NoSSRWrapper from "./components/NoSSRWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "🩳 SHORTS.JS",
  description: "Create Reddit-style short videos with a single click",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // see https://github.com/shadcn/next-contentlayer/issues/7
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ContentProvider>
          <NoSSRWrapper>
            <RendererProvider>
              <Nav />
              <main className="mx-auto flex max-w-4xl flex-wrap justify-center align-middle">
                {children}
              </main>
            </RendererProvider>
          </NoSSRWrapper>
        </ContentProvider>
      </body>
    </html>
  );
}
