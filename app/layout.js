import "./globals.css";

import { Cinzel, Crimson_Pro } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700", "900"],
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Visit Egypt — AI Travel Planner",
  description:
    "Discover the wonders of ancient Egypt with your AI-powered multi-agent travel guide",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${crimsonPro.variable}`}>
      <body className="bg-obsidian text-sand font-crimson antialiased">
        {children}
      </body>
    </html>
  );
}
