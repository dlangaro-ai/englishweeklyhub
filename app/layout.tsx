import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading"
});

const siteUrl = "https://tedank5.vercel.app";
const title = "TAK5 | English Weekly Hub";
const description = "A 2-semester English learning hub organized by week.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | TAK5`,
  },
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  robots: { index: true, follow: true },
  verification: {
    google: "XqYmKeZdMoYuJ3vhNCLOo99QVkTodb-Y7s4-_bEWhr8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={baloo.variable}>
      <body>
        {children}
        <footer className="siteFooter">
          © {new Date().getFullYear()} English Weekly Hub — DL. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
