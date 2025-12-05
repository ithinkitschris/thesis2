import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bargaining with the Future",
  description: "A speculative design exercise that seeks to investigate user agency in a fully agentic future",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Navbar />
        {children}
        
        {/* Floating Footer Bar - Persistent across all pages */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 h-auto flex items-center justify-center bg-white/5 backdrop-blur-sm border-t border-black/10 shadow-lg z-50 px-4 py-2.5 rounded-full">
          <p className="text-xs text-black/60 text-center tracking-tight leading-tight">
            v1.0. Work in Progress
          </p>
        </div>
      </body>
    </html>
  );
}
