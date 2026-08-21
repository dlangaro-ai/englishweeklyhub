import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "English Weekly Hub",
  description: "A 40-week English learning hub organized by skills.",
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
        <Analytics />
      </body>
    </html>
  );
}
