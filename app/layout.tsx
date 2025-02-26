import { baseUrl, createMetadata } from "@/lib/metadata";
import "@/styles/globals.css";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Body } from "./layout.client";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = createMetadata({
  title: {
    template: "%s | Meeting BaaS",
    default: "Meeting BaaS",
  },
  description: "Deploy AI for video meetings through a single unified API.",
  metadataBase: baseUrl,
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#fff" },
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} dark`} suppressHydrationWarning>
      <Body>
        <Providers>{children}</Providers>
      </Body>
    </html>
  );
}
