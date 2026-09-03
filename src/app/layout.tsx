import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: 'device-width',
  userScalable: false,
  interactiveWidget: 'resizes-content',
};

export const metadata: Metadata = {
  title: "Daisy the Dino's Day Away",
  description: "A children's book featuring Daisy the Dinosaur.",
  category: "Personal Site",
  other: {
    rel: 'preload',
    as: 'image',
    href: 'docs/daisy_the_dinosaurs_day_away/page-01.png'
  }
};

export default function RootLayout({
  children,
  book,
}: Readonly<{
  children: React.ReactNode;
  book: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-screen w-screen overflow-hidden">
        {children}
        {book}
      </body>
    </html>
  );
}
