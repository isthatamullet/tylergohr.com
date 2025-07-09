import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Tyler Gohr - Enterprise Solutions Architect",
  description: "Redirecting to main site...",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function Layout2({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}