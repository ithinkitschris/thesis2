import "./globals.css";
import Navbar from "./components/Navbar";
import Link from "next/link";

export const metadata = {
  title: "LifeOS",
  description: "A speculative design exercise into building trust in an agentic future",
  openGraph: {
    title: "LifeOS",
    description: "A speculative design exercise into building trust in an agentic future",
    type: "website",
    images: [
      {
        url: "/lifeosbadlogo.svg",
        width: 1200,
        height: 630,
        alt: "LifeOS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeOS",
    description: "A speculative design exercise into building trust in an agentic future",
    images: ["/lifeosbadlogo.svg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {children}
        
        {/* Floating Footer Bar - Persistent across all pages */}
        <Link href="/about" className="fixed bottom-6 left-1/2 transform -translate-x-1/2 h-auto flex items-center justify-center cursor-pointer bg-white/5 backdrop-blur-lg border-t border-black/10 shadow-lg z-50 px-4 py-2.5 rounded-full hover:text-black/80 transition-all duration-100 hover:scale-95 group">
          <p className="text-xs text-black/60 text-center font-medium tracking-tight leading-tight">
            A Speculative Design Thesis by Chris Leow • v1.1 • WIP
          </p>
        </Link>
      </body>
    </html>
  );
}
