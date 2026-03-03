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
  title: "Nitish Hansa | AI Developer & Software Engineer",
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
