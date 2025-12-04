"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isOverDark, setIsOverDark] = useState(true);
  const pathname = usePathname();
  const isAboutPage = pathname === "/about";

  useEffect(() => {
    // On about page, always use white navbar
    if (isAboutPage) {
      setIsOverDark(false);
      return;
    }

    const handleScroll = () => {
      // Hero section is 100vh, so when scrolled past that, navbar is over light background
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      setIsOverDark(scrollY < viewportHeight * 0.8); // Switch slightly before full scroll
    };

    // Check initial position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAboutPage]);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full px-1 py-1 shadow-lg backdrop-blur-[4px] transition-colors duration-300 ${
        isOverDark
          ? "bg-black/50 text-white"
          : "bg-white/50 text-black"
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
      </div>
    </nav>
  );
}

