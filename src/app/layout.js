import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL('https://nitish-portfolio.vercel.app'),
  title: {
    default: "Nitish Hansa | AI Developer & Software Engineer",
    template: "%s | Nitish Hansa",
  },
  description:
    "Portfolio of Nitish Hansa — AI Developer, Software Engineer, and Creative Technologist building intelligent systems and elegant digital experiences.",
  keywords: [
    "Nitish Hansa",
    "AI Developer",
    "Software Engineer",
    "Machine Learning",
    "Portfolio",
    "Creative Technologist",
  ],
  authors: [{ name: "Nitish Hansa" }],
  creator: "Nitish Hansa",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nitish-portfolio.vercel.app",
    title: "Nitish Hansa | AI Developer & Software Engineer",
    description: "Portfolio of Nitish Hansa — AI Developer, Software Engineer, and Creative Technologist building intelligent systems and elegant digital experiences.",
    siteName: "Nitish Hansa Portfolio",
    images: [
      {
        url: "/og-image.jpg", // We will let them know they need to place an image here later
        width: 1200,
        height: 630,
        alt: "Nitish Hansa - AI Developer & Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nitish Hansa | AI Developer & Software Engineer",
    description: "Portfolio of Nitish Hansa — AI Developer, Software Engineer, and Creative Technologist building intelligent systems and elegant digital experiences.",
    images: ["/og-image.jpg"],
    creator: "@nitishhansa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
        style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
      >
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
