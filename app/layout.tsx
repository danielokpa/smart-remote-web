import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";

import { QueryProvider } from "@/components/providers/QueryProvider";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Remote Care",
    template: "%s | Remote Care",
  },

  description:
    "Smart remote patient monitoring and healthcare management platform.",

  applicationName: "Remote Care",

  keywords: [
    "Remote Care",
    "remote patient monitoring",
    "healthcare monitoring",
    "patient monitoring",
    "healthcare management",
  ],

  icons: {
    icon: "/images/remote-care-logo.png",
    shortcut: "/images/remote-care-logo.png",
    apple: "/images/remote-care-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} antialiased bg-[#071A17] text-white no-scrollbar`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>

        {/* Google Maps API */}
        <Script
          id="google-maps-script"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}