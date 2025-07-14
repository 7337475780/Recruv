import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/ui/Navbar";
import StreamClientProvider from "@/components/providers/StreamClientPovider";

import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "600",
});

export const metadata: Metadata = {
  title: "Recruv",
  description: "Video Call Recruiting App",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable}  antialiased`}>
        <Providers>
          <div className="min-h-screen">
            <Navbar />
            <main className="px-4 sm:px-6 lg:px-8">{children}</main>
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
