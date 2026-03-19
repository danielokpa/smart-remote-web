import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PEPP Cruise",
  description: "Powering Movement with Clean Energy",
  icons: {
    icon: '/images/pepp_cruise_p_logo.webp',
    shortcut: '/images/pepp_cruise_p_logo.webp',
    apple: '/images/pepp_cruise_p_logo.webp',
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
      
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[--color-background]  text-[--color-foreground] no-scrollbar`}
      
      >
        {children}
        
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
