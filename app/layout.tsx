import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading"
});

export const metadata: Metadata = {
  title: "English Weekly Hub",
  description: "A 2-semester English learning hub organized by week.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={baloo.variable}>
      <body>
        <Providers>{children}</Providers>
        <footer className="siteFooter">
          © {new Date().getFullYear()} English Weekly Hub — DL. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
