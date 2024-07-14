import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./nav";
import { ThemeProvider } from "@/components/theme-provider";
import { ContentProvider } from "./content-provider";
import { RendererProvider } from "./renderer-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AITA.io",
  description: "Generate Am I the Asshole Reddit stories using AI!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ContentProvider>
            <RendererProvider>
              <Nav />
              <main className="mx-auto flex max-w-xl flex-wrap justify-center align-middle">
                {children}
              </main>
            </RendererProvider>
          </ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
