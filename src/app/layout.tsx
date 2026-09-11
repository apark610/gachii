import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Gachi — find your food people",
  description:
    "Gachi matches you with compatible dining partners based on your food preferences — a low-pressure, platonic way to meet new people over food.",
  icons: {
    icon: "/gachi-logo.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} antialiased`}
    >
      <body className="flex flex-col bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
