import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/app/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import { ContentProvider } from "@/app/providers/content-provider";
import { RendererProvider } from "@/app/providers/renderer-provider";

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
