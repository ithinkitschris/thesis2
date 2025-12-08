"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import OrchestratorVisual from "./components/OrchestratorVisual";


export default function Home() {
  const phonesRef = useRef(null);
  const isInView = useInView(phonesRef, { once: true, margin: "-100px" });

  const carouselRef = useRef(null);
  const orchestratorSectionRef = useRef(null);

  const carouselItems = [
    {
      image: "/energy.svg",
      title: "We see what's coming.",
      description: "Traffic patterns, weather shifts, energy levels, social dynamics. Thousands of simulations of your day are modeled before you even wake up."
    },
    {
      image: "/spotify.jpg",
      title: "We know you better than you do.",
      description: "Twenty years of memory. Every preference, every pattern, every unspoken need. LifeOS just understands."
    },
    {
      image: "/igmessages.svg",
      title: "No notice required.",
      description: "LifeOS handles your life in the background, so your attention stays where it belongs: on the one you're living, not the life you're managing."
    },
    {
      image: "/carousel-2.jpg",
      title: "Unified Intelligence.",
      description: "Phone, watch, glasses, home. A unified multimodal experience that moves, learns, and acts across your every waking moment."
    },
    {
      image: "/carousel-5.jpg",
      title: "Proactive Care",
      description: "LifeOS detects friction before it becomes failure: declining meetings that would drain you, reordering supplies before they run out, reaching out to friends before distance becomes drift."
    }
  ];

  const handlePrevSlide = () => {
    if (carouselRef.current) {
      const scrollAmount = 420 + 24; // card width + gap
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      // Update state after scroll animation completes
      setTimeout(() => {
        if (carouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
          const threshold = 10;
          setIsAtStart(scrollLeft <= threshold);
          setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - threshold);
        }
      }, 500); // Wait for smooth scroll to complete
    }
  };

  const handleNextSlide = () => {
    if (carouselRef.current) {
      const scrollAmount = 420 + 24; // card width + gap
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      // Update state after scroll animation completes
      setTimeout(() => {
        if (carouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
          const threshold = 10;
          setIsAtStart(scrollLeft <= threshold);
          setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - threshold);
        }
      }, 500); // Wait for smooth scroll to complete
    }
  };
  
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Track carousel scroll position
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const checkScrollPosition = () => {
      const { scrollLeft, scrollWidth, clientWidth } = carousel;
      const threshold = 10; // Small threshold to account for rounding

      setIsAtStart(scrollLeft <= threshold);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - threshold);
    };

    // Check initial position
    checkScrollPosition();

    // Listen to scroll events
    carousel.addEventListener('scroll', checkScrollPosition);
    
    // Also check on resize
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      carousel.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 pointer-events-none z-[1] shadow-2xl">
          <video 
            autoPlay
            loop
            muted
            playsInline
            className="absolute h-[106.83%] left-[-9.48%] max-w-none top-[-0.62%] w-[117.71%] object-cover " 
          >
            <source src="/lifeoscover.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Black Gradient Overlay at Top */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent pointer-events-none h-[20%] z-[2]"></div>

        {/* Logo and Slogan */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-8">
          {/* LifeOS Logo */}
          <div className="-mt-16 mb-3">
            <img 
              alt="LifeOS Logo" 
              src="/lifeoswhite.svg" 
              className="h-11 w-auto drop-shadow-[2px 4px 5px rgba(0, 0, 0, 1)]"
            />
          </div>
          <div 
            className="text-white text-6xl tracking-tight"
            style={{
              lineHeight: '1.1'
            }}
          >
            <p className="font-semibold ">The human spirit.</p>
            <p className="font-normal">Optimized.</p>
          </div>
        </div>
      </section>

      {/* Second Section - Stop Thinking Start Living */}
      <section className="relative w-full bg-white pt-18 pb-32 px-8 ">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 scale-[125%]">
          <img 
            src="/lotus.svg" 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Text Content */}
          <div className="text-center mb-14">
            <div className="mb-5 flex justify-center">
              <img 
                alt="LifeOS Logo" 
                src="/lifeosbadlogo.svg" 
                className="h-20 w-auto drop-shadow-md"
              />
            </div>
            <h2 
              className="text-[38pt] font-semibold text-black mb-6 leading-none tracking-[-0.48px] drop-shadow-md"
              style={{
                opacity: 0.67
              }}
            >
              Stop thinking.
              <br />
              Start living.
            </h2>
          </div>

          {/* iPhone Mockups */}
          <div ref={phonesRef} className="relative flex items-center justify-center flex-wrap" style={{ perspective: 1000 }}>
            {/* bezel-1 - Leftmost, slides out from middle */}
            <motion.div 
              className="relative w-[220px] h-[449px] z-10"
              initial={{ x: 360, rotateY: 0 }}
              animate={isInView ? { x: 0, rotateY: 10 } : { x: 500, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <img 
                alt="iPhone bezel" 
                className="w-full h-full object-contain" 
                style={{ filter: 'drop-shadow(10px 15px 20px rgba(0, 0, 0, 0.2))' }}
                src="/iPhone bezel-1.svg" 
              />
            </motion.div>
            
            {/* bezel-3 - Left of center, slides out from middle */}
            <motion.div 
              className="relative w-[241px] h-[491px] -ml-20 z-20"
              initial={{ x: 200, rotateY: 0 }}
              animate={isInView ? { x: 0, rotateY: 5 } : { x: 136, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <img 
                alt="iPhone bezel" 
                className="w-full h-full object-contain" 
                style={{ filter: 'drop-shadow(10px 15px 20px rgba(0, 0, 0, 0.2))' }}
                src="/iPhone bezel-3.svg" 
              />
            </motion.div>
            
            {/* bezel-4 - Center, appears first */}
            <motion.div 
              className="relative w-[272px] h-[554px] -ml-16 z-30"
              initial={{ scale: 0.8 }}
              animate={isInView ? { scale: 1 } : { scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0, ease: [0.16, 1, 0.3, 1] }}
            >
              <img 
                alt="iPhone bezel" 
                className="w-full h-full object-contain" 
                style={{ filter: 'drop-shadow(10px 15px 20px rgba(0, 0, 0, 0.25))' }}
                src="/iPhone bezel-4.svg" 
              />
            </motion.div>
            
            {/* bezel.svg - Right of center, slides out from middle */}
            <motion.div 
              className="relative w-[241px] h-[491px] -ml-16 z-20"
              initial={{ x: -206, rotateY: 0 }}
              animate={isInView ? { x: 0, rotateY: -5 } : { x: -136, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <img 
                alt="iPhone bezel" 
                className="w-full h-full object-contain" 
                style={{ filter: 'drop-shadow(10px 15px 20px rgba(0, 0, 0, 0.2))' }}
                src="/iPhone bezel.svg" 
              />
            </motion.div>
            
            {/* bezel-2 - Rightmost, slides out from middle */}
            <motion.div 
              className="relative w-[220px] h-[449px] -ml-20 z-10"
              initial={{ x: -350, rotateY: 0 }}
              animate={isInView ? { x: 0, rotateY: -10 } : { x: -300, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <img 
                alt="iPhone bezel" 
                className="w-full h-full object-contain" 
                style={{ filter: 'drop-shadow(10px 15px 20px rgba(0, 0, 0, 0.2))' }}
                src="/iPhone bezel-2.svg" 
              />
            </motion.div>
          </div>
          
          {/* Subheading below mockups */}
          <div className="text-center mt-20 w-full">
            <p className="text-xl md:text-2xl font-semibold text-black/70 tracking-[-0.01em] mb-4">
              Meet the world's first fully agentic operating system.
            </p>
            <p className="text-xl font-medium text-black/70 tracking-[-0.01em] w-[55%] mx-auto">
            LifeOS anticipates what you need, acts on your behalf, and quietly handles the thousands of small decisions that used to fill your day.
            </p>
            <p className="text-xl font-medium text-black/70 tracking-[-0.01em] w-[55%] mx-auto">Less screen time. Less decision fatigue. More you.</p>
          </div>
        </div>
      </section>

      {/* Third Section - Carousel */}
      <section className="relative w-full py-0 mb-20 overflow-hidden">

        {/* Section Title */}
        <div className="px-8 max-w-8xl mx-auto">
          <div className="text-left mt-4 mb-10 ml-4">
            <h2
              className="text-6xl font-semibold tracking-tight bg-gradient-to-br from-[#777777] to-[#292929] bg-clip-text text-transparent pb-2 drop-shadow-md"
            >
              Intelligence that <br/>finally works for you.
            </h2>
          </div>
        </div>

        {/* Carousel Container - extends beyond viewport */}
        <div className="relative pl-[6%]">
          {/* Carousel Items */}
          <div ref={carouselRef} className="flex gap-5 overflow-x-scroll snap-x snap-mandatory pb-8 pr-8 rounded-[28pt]"
               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {carouselItems.map((item, index) => (
              <div
                key={index}
                className="snap-start flex-shrink-0"
                style={{ width: '420px' }}
              >
                {/* Rounded Rectangle Card */}
                <div className=" overflow-hidden h-full">
                  {/* Image */}
                  <div className={`aspect-[4/5] rounded-[28pt] overflow-hidden flex items-center justify-center ${
                    index === 0 
                      ? 'bg-gradient-to-b from-[#ffd68f] to-[#ff9372]' 
                      : index === 1
                      ? 'bg-gradient-to-b from-[#79dbff] to-[#2fa1ff]'
                      : index === 2
                      ? 'bg-gradient-to-b from-[#ff9dd8] to-[#ff7394]'
                      : index === 3
                      ? 'bg-gradient-to-b from-[#5573f7] to-[#7c3aed]'
                      : index === 4
                      ? 'bg-gradient-to-b from-[#ffd36e] to-[#ff8c78]'
                      : 'bg-black/10'
                  }`}>
                    {index === 0 && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain p-8"
                      />
                    )}
                    {index === 1 && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover scale-[115%] ml-1 mt-4"
                      />
                    )}
                    {index === 2 && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain pt-5 p-4 scale-100"
                      />
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="mt-6 ml-3">
                    <h3 className="text-black/65 text-xl font-semibold tracking-[-0.01em] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-black/50 text-md tracking-[-0.01em]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-end gap-3 mt-8 mr-10">
            <button
              onClick={handlePrevSlide}
              className={`w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 cursor-pointer transition-all duration-100 flex items-center justify-center ${isAtStart ? 'opacity-30' : ''}`}
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6 mr-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleNextSlide}
              className={`w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 cursor-pointer transition-all duration-100 flex items-center justify-center ${isAtEnd ? 'opacity-30' : ''}`}
              aria-label="Next slide"
            >
              <svg className="w-6 h-6 ml-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Fourth Section - Orchestrator */}
      <section ref={orchestratorSectionRef} className="relative w-full pt-10 pb-28">
        <div className="max-w-8xl mx-auto flex flex-col items-center px-10">

          {/* Header */}
          <div className="text-center max-w-3xl">
            <h2
              className="text-6xl font-semibold mb-32 tracking-tight bg-gradient-to-br from-[#777777] to-[#171717] bg-clip-text text-transparent drop-shadow-md"
            >
              One intelligence.
              <br />
              Infinite coordination.
            </h2>
          </div>
          
          {/* Orchestrator visual with orbiting animation */}
          <div className="flex justify-center">
            <div className="w-full h-auto max-w-7xl scale-115" style={{ filter: 'drop-shadow(2px 5px 10px rgba(0, 0, 0, 0.09))' }}>
              <OrchestratorVisual sectionRef={orchestratorSectionRef} />
            </div>
          </div>
          
          {/* Description */}
          <div className="text-center max-w-3xl mt-28">
            <p className="text-black/65 text-3xl mb-4 font-semibold tracking-[-0.01em] leading-tight">
            Meet the Orchestrator.
            </p>
            <p className="text-black/50 text-2xl font-medium tracking-[-0.01em] leading-tight">
            Anticipating what you need, coordinating every subsystem, and executing decisions across every domain of your life. The Orchestrator handles life's complexity while keeping yours beautifully simple.
            </p>
          </div>
        </div>
      </section>

      {/* Fifth Section - Personal Knowledge Graph */}
      <section className="relative w-full pt-20 pb-32 bg-black/3">
        <div className="max-w-8xl mx-auto flex flex-col items-center px-10">
          {/* Title - Center Aligned at Top */}
          <h2
            className="text-6xl font-semibold bg-gradient-to-br from-[#66d6ff] to-[#008cff] bg-clip-text text-transparent pb-16 tracking-tight text-center drop-shadow-md"
          >
            Wake up to a day <br /> that's already solved.
          </h2>

          {/* iPad Image */}
          <div className="flex justify-center mb-16">
            <img
              src="/day.png"
              alt="Personal Knowledge Graph Interface"
              className="w-full h-auto drop-shadow-xl max-w-4xl scale-110"
            />
          </div>

          {/* Description Below iPad */}
          <p className="text-black/65 text-2xl mb-4 font-semibold tracking-[-0.01em] leading-tight">
          No planning. No prioritizing. No wondering what comes next.
          </p>
          <p className="text-black/50 text-2xl font-medium tracking-[-0.01em] leading-tight">
          LifeOS simulates thousands of possible days and delivers one day designed around <br/>who you are and what you need. No decisions required. All that's left is living it.
          </p>
        </div>
      </section>

      {/* Sixth Section - Personal Knowledge Graph (Left-Right Layout) */}
      <section className="relative w-full pt-48 pb-64 bg-black/98">
        <div className="max-w-8xl mx-auto pl-10 pr-4">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">

            {/* Left Side - Header and Description */}
            <div className="flex-1">
              <h2
                className="text-7xl font-medium bg-gradient-to-br from-[#30c8ff] to-[#008cff] bg-clip-text text-transparent mb-6 tracking-tight"
              >
                Personal <br/>Knowledge<br/> Graph
              </h2>
              <p className="text-white/80 text-xl w-[80%]">
                Your entire life, relationships, preferences, and patterns—all connected in one intelligent graph that understands context, learns continuously, and anticipates your needs before you do.
              </p>
            </div>

            {/* Right Side - iPad Image */}
            <div className="flex-[1.5] flex justify-center lg:justify-end items-start">
              <img
                src="/pkg.svg"
                alt="Personal Knowledge Graph Interface"
                className="w-full h-auto drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
