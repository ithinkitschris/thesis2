"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isOverDark, setIsOverDark] = useState(true);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    // Only enable dark/light switching on home page
    if (!isHomePage) {
      // On all other pages, use white navbar
      setIsOverDark(false);
      return;
    }

    // Find section 6 element
    const section6 = document.getElementById("section-6");
    
    const handleScroll = () => {
      // Check if section 6 is in viewport
      if (section6) {
        const rect = section6.getBoundingClientRect();
        const isInSection6 = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInSection6) {
          setIsOverDark(true);
          return;
        }
      }

      // Hero section is 100vh, so when scrolled past that, navbar is over light background
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      setIsOverDark(scrollY < viewportHeight * 0.8); // Switch slightly before full scroll
    };

    // Check initial position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 border-b-1 border-r-1 rounded-full px-0.5 py-0.5 shadow-lg backdrop-blur-[10px] transition-colors duration-300 ${
        isOverDark
          ? "bg-black/50 text-white border-white/10"
          : "bg-white/50 text-black border-white/40"
      }`}
    >
      <div className="flex justify-center -space-x-2">
        <Link
          href="/"
          className={`text-base font-medium tracking-tight transition-all duration-100 hover:scale-90 rounded-full px-4 py-2 ${
            isOverDark
              ? "hover:bg-white/20"
              : "hover:bg-black/20"
          }`}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={`text-base font-medium tracking-tight transition-all duration-100 hover:scale-90 rounded-full px-4 py-2 ${
            isOverDark
              ? "hover:bg-white/20"
              : "hover:bg-black/20"
          }`}
        >
          About
        </Link>
        <Link
          href="/sandbox"
          className={`text-base font-medium tracking-tight transition-all duration-100 hover:scale-90 rounded-full px-4 py-2 ${
            isOverDark
              ? "hover:bg-white/20"
              : "hover:bg-black/20"
          }`}
        >
          Sandbox
        </Link>
      </div>
    </nav>
  );
}

