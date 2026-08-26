import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

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
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <footer className="siteFooter">
          © {new Date().getFullYear()} English Weekly Hub — DL. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
