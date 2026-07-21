import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { AuthSession } from "@/components/shared/AuthSession";
import { SocketProvider } from "@/components/shared/SocketProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Review Platform",
  description: "LLM-powered code review platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <Theme
          appearance="dark"
          accentColor="gray"
          radius="medium"
          className="flex min-h-dvh flex-1 flex-col"
        >
          <AuthSession />
          <SocketProvider />
          {children}
        </Theme>
      </body>
    </html>
  );
}
