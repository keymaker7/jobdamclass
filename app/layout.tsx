import type { Metadata } from "next";
import "./globals.css";
import "./enhancements.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jobdam-class.vercel.app"),
  alternates: { canonical: "/" },
  robots: { index: false, follow: false },
  title: "꿈터뷰 · 나의 진로 면담 스튜디오",
  description: "궁금한 직업을 만나고, 좋은 질문을 연습하고, 나만의 진로 면담 포트폴리오를 완성해요.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}

