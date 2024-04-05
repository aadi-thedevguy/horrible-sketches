import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Nav";
import SignOutButton from "@/components/SignOutButton"
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Horrible Sketches",
  description: "Show how bad you can sketch to your friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
          <Toaster />
        <Navbar><SignOutButton /></Navbar>
        <>
          {children}
        </>
          <p className="absolute bottom-1 w-full text-center">©️ <a href="https://thedevguy.in" target="__blank" rel="noreferrer">TheDevGuy.</a> All rights Reserved.</p>
        </body>
    </html>
  );
}
