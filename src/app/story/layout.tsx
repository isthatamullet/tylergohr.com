import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Tyler Gohr - My Story",
  description:
    "16 years of fixing content operations that couldn't scale. From Fuel TV to Fox Corporation, here's how I figured it out.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Story page is full-screen Reveal.js - no nav, no wrapper */}
      {children}
    </>
  );
}
