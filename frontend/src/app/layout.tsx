import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LayoutWrapper from "./LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// This is Next.js metadata configuration. It tells Next.js what information to put in the page’s HTML <head>.
// <meta name="description" content="Buy Books">
// <meta charset="UTF-8">
// <title>Buy Books!</title>
// The <meta> tag is used to provide information about the webpage to the browser, search engines, and other services.
export const metadata: Metadata = {
  title: "Buy Books!",
  description: "Buy Books.",
};

//  both layout and page can be client component
export default function RootLayout( {children}: Readonly<{ children: React.ReactNode }>) {
  // smooths the edges of text : antialiased
  return (
    <html lang="en">

      <body className={`${geistSans.variable}  ${geistMono.variable} antialiased`}>

        <LayoutWrapper>
          <Header />
          {children}
          <Footer />
        </LayoutWrapper>

      </body>

    </html>
  );
}

// Next.js
//    ↓
// layout.tsx
//    ↓
// LayoutWrapper.tsx
//    ↓
// AuthCheck.ts
//    ↓
// children (page.tsx)

// type Product = {
//   id: number;
//   title: string;
// };

// const p: Readonly<Product> = {
//   id: 1,
//   title: "Phone",
// };

// p.title = "Laptop"; // ❌ Error

// In TypeScript, “read-only” usually means making something immutable (cannot be changed after creation).
