import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tynderella - Swipe Right on Your Style",
  description:
    "Discover fashion you love through an intuitive swipe experience. Curated pieces matched to your taste, ready to shop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50">
        {children}
      </body>
    </html>
  );
}
