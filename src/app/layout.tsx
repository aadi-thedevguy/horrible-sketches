import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Horrible Sketches",
  description: "Show how bad you can sketch to your friends",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Toaster />
          <Navbar />

          <main className="my-4">{children}</main>
          <p className="mt-4 p-4 w-full text-center">
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
