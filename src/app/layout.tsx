import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { constants } from "@/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: constants.SITE_TITLE,
  description: constants.SITE_DESCRIPTION,
  openGraph: {
    title: constants.SITE_TITLE,
    description: constants.SITE_DESCRIPTION,
    images: [
      {
        url: constants.THUMBNAIL,
        width: 1920,
        height: 1080,
        alt: constants.SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: constants.SITE_TITLE,
    description: constants.SITE_DESCRIPTION,
    images: [constants.THUMBNAIL],
    creator: "@thedevguy.in",
  },
  icons: constants.ICON,
  metadataBase: new URL(constants.SITE_URL),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SpeedInsights />
        <Analytics />
        <Providers>
          <Toaster />
          <Navbar />

          <main className="my-4">{children}</main>
          <p className="mt-4 p-4 w-full text-center relative bottom-0">
            ©️ {new Date().getFullYear()}
            <a
              href="https://thedevguy.in"
              target="__blank"
              rel="noopener noreferrer"
              className="hover:underline ml-1"
            >
              TheDevGuy.
            </a>{" "}
            All rights Reserved.
          </p>
        </Providers>
      </body>
    </html>
  );
}
