import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Lato,
  Poppins,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

import { ToastProvider } from "@/providers/ToastProvider";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jet-brains-mono",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Propreso | AI-Powered Proposal Generator for Freelancers",
  description:
    "Create winning freelance proposals in seconds with AI-powered suggestions. Propreso helps you craft personalized, professional proposals for Upwork, Fiverr, and other freelance platforms.",
  keywords: [
    "freelance proposals",
    "AI proposal generator",
    "Upwork proposals",
    "freelance tools",
    "job application",
    "freelancer platform",
  ],
  authors: [{ name: "Propreso Team" }],
  metadataBase: new URL("https://propreso.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://propreso.com",
    title: "Propreso | AI-Powered Proposal Generator for Freelancers",
    description:
      "Create winning freelance proposals in seconds with AI-powered suggestions.",
    siteName: "Propreso",
    images: [
      {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Propreso - AI-Powered Proposal Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Propreso | AI-Powered Proposal Generator",
    description:
      "Create winning freelance proposals in seconds with AI-powered suggestions.",
    images: ["/assets/twitter-image.jpg"],
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
        suppressHydrationWarning
        className={`${inter.variable} ${jetBrainsMono.variable} ${lato.variable} ${poppins.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NextAuthProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
