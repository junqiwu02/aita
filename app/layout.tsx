import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AITA.io",
  description: "Generate Am I the Asshole Reddit stories using Ai!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Nav />
        <main className="mx-auto flex max-w-xl flex-wrap justify-center align-middle">
          {children}
        </main>
      </body>
    </html>
  );
}
