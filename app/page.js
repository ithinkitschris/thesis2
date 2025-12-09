"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import OrchestratorVisual from "./components/OrchestratorVisual";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


export default function Home() {
  const phonesRef = useRef(null);
  const isInView = useInView(phonesRef, { once: true, margin: "-100px" });

  const carouselRef = useRef(null);
  const orchestratorSectionRef = useRef(null);
  const contextCategoriesRef = useRef(null);
  const categoryItemsRef = useRef([]);
  const section6Ref = useRef(null);
  const section6HeaderRef = useRef(null);
  const section6DescriptionRef = useRef(null);
  const section6IpadRef = useRef(null);

  const carouselItems = [
    {
      image: "/energy.svg",
      title: "We see what's coming.",
      description: "Traffic patterns, weather shifts, energy levels, social dynamics. Thousands of simulations of your day are modeled before you even wake up."
    },
    {
      image: "/igmessages.jpg",
      title: "No notice required.",
      description: "LifeOS handles your life in the background, so your attention stays where it belongs: on the one you're living, not the life you're managing."
    },
    {
      image: "/spotify.jpg",
      title: "We know you better than you do.",
      description: "Twenty years of memory. Every preference, every pattern, every unspoken need. LifeOS just understands."
    },
    {
      image: "/multimodal.jpg",
      title: "Uni-modal.",
      description: "Phone, watch, glasses, home. A unified multimodal experience that moves, learns, and acts across your every waking moment."
    },
    {
      image: "/proactive.jpg",
      title: "Pro Active.",
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

  // GSAP ScrollTrigger animation for context categories
  useEffect(() => {
    if (!contextCategoriesRef.current || !section6Ref.current) return;

    const items = categoryItemsRef.current.filter(Boolean);
    if (items.length === 0) return;

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.id === 'categories-scroll') {
        trigger.kill();
      }
    });

    // Set initial states - first item visible, rest hidden
    gsap.set(contextCategoriesRef.current, { y: 0, scale: 1.5 });
    gsap.set(items[0], { opacity: 1 });
    items.slice(1).forEach(item => {
      gsap.set(item, { opacity: 0.25 });
    });

    // Set initial states for header, description, and iPad - hidden and positioned below
    gsap.set(section6HeaderRef.current, { opacity: 0, y: 50 });
    gsap.set(section6DescriptionRef.current, { opacity: 0, y: 50 });
    gsap.set(section6IpadRef.current, { opacity: 0, y: 50 });

    // Create ScrollTrigger with phases for each item
    ScrollTrigger.create({
      id: 'categories-scroll',
      trigger: section6Ref.current,
      start: 'top top',
      end: '+=150%',
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress; // 0 to 1

        // Phase 1: 0-12% (Context → Environment) - 20% of Phase 1 (6 lines)
        if (progress <= 0.12) {
          const phase1Progress = progress / 0.12;
          const easedProgress = gsap.parseEase("power3.inOut")(phase1Progress);

          // Scale from 1.5 to 1 over 0-80% progress (independent easing: power2.inOut)
          const scaleProgress = Math.min(1, progress / 0.8);
          const scaleEased = gsap.parseEase("power2.inOut")(scaleProgress);
          const scale = 1.5 - (0.5 * scaleEased);

          // Container moves upward and scales
          gsap.set(contextCategoriesRef.current, {
            y: -65 * easedProgress,
            scale: scale
          });

          gsap.set(items[0], {
            opacity: 1 - (0.75 * easedProgress)
          });

          gsap.set(items[1], {
            opacity: 0.25 + (0.75 * easedProgress)
          });

          // Keep rest at initial state
          items.slice(2).forEach(item => gsap.set(item, { opacity: 0.25 }));

          // Ensure header, description, and iPad are hidden in Phase 1
          gsap.set(section6HeaderRef.current, { opacity: 0, y: 50 });
          gsap.set(section6DescriptionRef.current, { opacity: 0, y: 50 });
          gsap.set(section6IpadRef.current, { opacity: 0, y: 50 });
        }
        // Phase 2: 12-24% (Environment → Psychology) - 20% of Phase 1
        else if (progress <= 0.24) {
          const phase2Progress = (progress - 0.12) / 0.12;
          const easedProgress = gsap.parseEase("power3.inOut")(phase2Progress);

          // Scale from 1.5 to 1 over 0-80% progress (independent easing: power2.inOut)
          const scaleProgress = Math.min(1, progress / 0.8);
          const scaleEased = gsap.parseEase("power2.inOut")(scaleProgress);
          const scale = 1.5 - (0.5 * scaleEased);

          // Container moves upward (cumulative -130px) and scales
          gsap.set(contextCategoriesRef.current, {
            y: -65 - (65 * easedProgress),
            scale: scale
          });

          gsap.set(items[0], { opacity: 0.25 });

          gsap.set(items[1], {
            opacity: 1 - (0.75 * easedProgress)
          });

          gsap.set(items[2], {
            opacity: 0.25 + (0.75 * easedProgress)
          });

          items.slice(3).forEach(item => gsap.set(item, { opacity: 0.25 }));

          // Ensure header, description, and iPad are hidden in Phase 2
          gsap.set(section6HeaderRef.current, { opacity: 0, y: 50 });
          gsap.set(section6DescriptionRef.current, { opacity: 0, y: 50 });
          gsap.set(section6IpadRef.current, { opacity: 0, y: 50 });
        }
        // Phase 3: 24-36% (Psychology → Biometrics) - 20% of Phase 1
        else if (progress <= 0.36) {
          const phase3Progress = (progress - 0.24) / 0.12;
          const easedProgress = gsap.parseEase("power3.inOut")(phase3Progress);

          // Scale from 1.5 to 1 over 0-80% progress (independent easing: power2.inOut)
          const scaleProgress = Math.min(1, progress / 0.8);
          const scaleEased = gsap.parseEase("power2.inOut")(scaleProgress);
          const scale = 1.5 - (0.5 * scaleEased);

          // Container moves upward (cumulative -195px) and scales
          gsap.set(contextCategoriesRef.current, {
            y: -130 - (65 * easedProgress),
            scale: scale
          });

          gsap.set(items[0], { opacity: 0.25 });
          gsap.set(items[1], { opacity: 0.25 });

          gsap.set(items[2], {
            opacity: 1 - (0.75 * easedProgress)
          });

          gsap.set(items[3], {
            opacity: 0.25 + (0.75 * easedProgress)
          });

          items.slice(4).forEach(item => gsap.set(item, { opacity: 0.25 }));

          // Ensure header, description, and iPad are hidden in Phase 3
          gsap.set(section6HeaderRef.current, { opacity: 0, y: 50 });
          gsap.set(section6DescriptionRef.current, { opacity: 0, y: 50 });
          gsap.set(section6IpadRef.current, { opacity: 0, y: 50 });
        }
        // Phase 4: 36-48% (Biometrics → Relationships) - 20% of Phase 1
        else if (progress <= 0.48) {
          const phase4Progress = (progress - 0.36) / 0.12;
          const easedProgress = gsap.parseEase("power3.inOut")(phase4Progress);

          // Scale from 1.5 to 1 over 0-80% progress (independent easing: power2.inOut)
          const scaleProgress = Math.min(1, progress / 0.8);
          const scaleEased = gsap.parseEase("power2.inOut")(scaleProgress);
          const scale = 1.5 - (0.5 * scaleEased);

          // Container moves upward (cumulative -260px) and scales
          gsap.set(contextCategoriesRef.current, {
            y: -195 - (65 * easedProgress),
            scale: scale
          });

          items.slice(0, 3).forEach(item => gsap.set(item, { opacity: 0.25 }));

          gsap.set(items[3], {
            opacity: 1 - (0.75 * easedProgress)
          });

          gsap.set(items[4], {
            opacity: 0.25 + (0.75 * easedProgress)
          });

          gsap.set(items[5], { opacity: 0.25 });

          // Ensure header, description, and iPad are hidden in Phase 4
          gsap.set(section6HeaderRef.current, { opacity: 0, y: 50 });
          gsap.set(section6DescriptionRef.current, { opacity: 0, y: 50 });
          gsap.set(section6IpadRef.current, { opacity: 0, y: 50 });
        }
        // Phase 5: 48-60% (Relationships → Communication) - 20% of Phase 1
        else if (progress <= 0.6) {
          const phase5Progress = (progress - 0.48) / 0.12;
          const easedProgress = gsap.parseEase("power3.inOut")(phase5Progress);

          // Scale from 1.5 to 1 over 0-80% progress (independent easing: power2.inOut)
          const scaleProgress = Math.min(1, progress / 0.8);
          const scaleEased = gsap.parseEase("power2.inOut")(scaleProgress);
          const scale = 1.5 - (0.5 * scaleEased);

          // Container moves upward (cumulative -325px) and scales
          gsap.set(contextCategoriesRef.current, {
            y: -260 - (65 * easedProgress),
            scale: scale
          });

          items.slice(0, 4).forEach(item => gsap.set(item, { opacity: 0.25 }));

          gsap.set(items[4], {
            opacity: 1 - (0.75 * easedProgress)
          });

          gsap.set(items[5], {
            opacity: 0.25 + (0.75 * easedProgress)
          });

          // Ensure header, description, and iPad are hidden in Phase 5
          gsap.set(section6HeaderRef.current, { opacity: 0, y: 50 });
          gsap.set(section6DescriptionRef.current, { opacity: 0, y: 50 });
          gsap.set(section6IpadRef.current, { opacity: 0, y: 50 });
        }
        // Transition Phase: 60-70% (Fade out all categories completely)
        else if (progress <= 0.7) {
          const transitionProgress = (progress - 0.6) / 0.1;
          const easedProgress = gsap.parseEase("power3.inOut")(transitionProgress);

          // Fade out all category items completely
          items.forEach(item => {
            gsap.set(item, { opacity: 0.25 - (0.25 * easedProgress) });
          });

          // Fade out the categories container completely, maintain scale at 1
          gsap.set(contextCategoriesRef.current, {
            opacity: 1 - easedProgress,
            scale: 1
          });

          // Start fading in header during transition phase (overlap with category fade-out)
          // Header starts fading in at 65% overall progress (50% through transition phase)
          // Use same calculation as Phase 6 for continuity: 65% to 85% overall
          const headerOverallStart = 0.65;
          const headerOverallEnd = 0.85;
          if (progress >= headerOverallStart) {
            const headerProgress = Math.max(0, Math.min(1, (progress - headerOverallStart) / (headerOverallEnd - headerOverallStart)));
            const headerEased = gsap.parseEase("power3.out")(headerProgress);
            gsap.set(section6HeaderRef.current, {
              opacity: headerEased,
              y: 50 - (50 * headerEased)
            });
          } else {
            gsap.set(section6HeaderRef.current, { opacity: 0, y: 50 });
          }

          // Ensure description and iPad remain hidden
          gsap.set(section6DescriptionRef.current, { opacity: 0, y: 50 });
          gsap.set(section6IpadRef.current, { opacity: 0, y: 50 });
        }
        // Phase 6: 70-100% (Animate in header/description/iPad) - Phase 2 (30%)
        else {
          const phase6Progress = (progress - 0.7) / 0.3;

          // Ensure categories stay completely faded out (already faded in transition phase)
          items.forEach(item => {
            gsap.set(item, { opacity: 0 });
          });
          gsap.set(contextCategoriesRef.current, {
            opacity: 0,
            scale: 1
          });

          // Animate in header, description, and iPad from below (staggered/overlapping)
          // Header: continues from transition phase overlap, completes at 50% of phase 6
          // Header already started at 65% overall (during transition), so at 70% it's partially visible
          // Calculate header progress from 65% to 85% overall (continuous from transition phase)
          const headerOverallStart = 0.65;
          const headerOverallEnd = 0.85; // 70% + (50% of 30% = 15%)
          const headerProgress = Math.max(0, Math.min(1, (progress - headerOverallStart) / (headerOverallEnd - headerOverallStart)));
          const headerEased = gsap.parseEase("power3.out")(headerProgress);
          gsap.set(section6HeaderRef.current, {
            opacity: headerEased,
            y: 50 - (50 * headerEased)
          });

          // Description: 20-70% of phase 6 (starts while header is animating)
          const descStart = 0.2;
          const descEnd = 0.7;
          let descProgress = 0;
          if (phase6Progress >= descStart) {
            descProgress = Math.max(0, Math.min(1, (phase6Progress - descStart) / (descEnd - descStart)));
          }
          const descEased = gsap.parseEase("power3.out")(descProgress);
          gsap.set(section6DescriptionRef.current, {
            opacity: descEased,
            y: 50 - (50 * descEased)
          });

          // iPad: 40-100% of phase 6 (starts while description is animating)
          const ipadStart = 0.4;
          const ipadEnd = 1.0;
          let ipadProgress = 0;
          if (phase6Progress >= ipadStart) {
            ipadProgress = Math.max(0, Math.min(1, (phase6Progress - ipadStart) / (ipadEnd - ipadStart)));
          }
          const ipadEased = gsap.parseEase("power3.out")(ipadProgress);
          gsap.set(section6IpadRef.current, {
            opacity: ipadEased,
            y: 50 - (50 * ipadEased)
          });
        }
      }
    });

    // Refresh ScrollTrigger after a brief delay to ensure layout is stable
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.id === 'categories-scroll') {
          trigger.kill();
        }
      });
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
              className="text-[42pt] font-semibold bg-gradient-to-br from-[#66d6ff] to-[#008cff] bg-clip-text text-transparent mb-6 leading-none tracking-[-0.48px] drop-shadow-sm pb-2"
            >
              Less thinking.
              <br />
              More living.
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
            <p className="text-black/80 text-3xl mb-4 font-semibold tracking-[-0.01em] leading-tight">
              Meet the world's first fully agentic operating system.
            </p>
            <p className="text-black/50 text-xl font-medium tracking-[-0.01em] leading-tight w-[50%] mx-auto">
            LifeOS anticipates what you need, acts on your behalf, and quietly handles the thousands of small decisions that used to fill your day.
            </p>
            <p className="text-black/50 text-xl font-medium tracking-[-0.01em] leading-tight">Less screen time. Less decision fatigue. More you.</p>
          </div>
        </div>
      </section>

      {/* Third Section - Carousel */}
      <section className="relative w-full py-0 mb-20 overflow-hidden">

        {/* Section Title and Navigation Arrows */}
        <div className="px-8 max-w-8xl mx-auto">

          <div className="flex items-end justify-between mt-4 mb-10 pl-12">

            {/* Header */}
            <h2 className="text-[38pt] leading-none font-semibold tracking-tight bg-gradient-to-br from-[#777777] to-[#343434] bg-clip-text text-transparent pb-2 drop-shadow-md opacity-00">
              Intelligence that <br/>finally works for you.
            </h2>
            
            {/* Navigation Arrows */}
            <div className="flex gap-3">
              <button
                onClick={handlePrevSlide}
                className={`w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 transition-all duration-100 flex items-center justify-center ${isAtStart ? 'opacity-30' : ''}`}
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6 mr-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextSlide}
                className={`w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 transition-all duration-100 flex items-center justify-center ${isAtEnd ? 'opacity-30' : ''}`}
                aria-label="Next slide"
              >
                <svg className="w-6 h-6 ml-0.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>

        </div>

        {/* Carousel Container - extends beyond viewport */}
        <div className="relative pl-12 max-w-8xl mx-auto">
          {/* Carousel Items */}
          <div ref={carouselRef} className="flex gap-5 overflow-x-scroll snap-x snap-mandatory pb-8 pr-8 rounded-[22pt]"
               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {carouselItems.map((item, index) => (
              <div
                key={index}
                className="snap-start flex-shrink-0"
                style={{ width: '360px' }}
              >
                {/* Rounded Rectangle Card */}
                <div className=" overflow-hidden h-full">
                  {/* Image */}
                  <div className={`aspect-[3.5/4.8] rounded-[22pt] overflow-hidden flex items-center justify-center ${
                    index === 0 
                      ? 'bg-gradient-to-b from-[#ffd289] to-[#ff8e61]' 
                      : index === 1
                      ? 'bg-gradient-to-b from-[#ff9dd8] to-[#ff7394]'
                      : index === 2
                      ? 'bg-gradient-to-b from-[#79dbff] to-[#2fa1ff]'
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
                        className="w-full h-full object-contain p-5"
                      />
                    )}
                    {index === 1 && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover scale-100"
                      />
                    )}
                    {index === 2 && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover "
                      />
                    )}
                    {index === 3 && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {index === 4 && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="mt-6 ml-3">
                    <h3 className="text-black/80 text-xl font-semibold tracking-[-0.02em] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-black/60 text-md tracking-[-0.01em] w-[95%]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fourth Section - Orchestrator */}
      <section ref={orchestratorSectionRef} className="relative w-full pt-10 pb-28">
        <div className="max-w-8xl mx-auto flex flex-col items-center px-10">

          {/* Header */}
          <div className="text-center max-w-3xl">
            <h2
              className="text-6xl font-semibold mb-32 pb-2 tracking-tight bg-gradient-to-br from-[#777777] to-[#171717] bg-clip-text text-transparent drop-shadow-md"
            >
              Finite life.
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
            <p className="text-black/80 text-3xl mb-4 font-semibold tracking-[-0.01em] leading-tight">
            Meet the Orchestrator.
            </p>
            <p className="text-black/50 text-2xl font-medium tracking-[-0.01em] leading-tight">
            Anticipating what you need, coordinating every subsystem, and executing decisions across every domain of your life. The Orchestrator handles life's complexity while keeping yours beautifully simple.
            </p>
          </div>
        </div>
      </section>

      {/* Fifth Section - Personal Knowledge Graph */}
      <section className="relative w-full pt-20 pb-32 bg-gradient-to-b from-[#ffffff]  via-[#ddfeff] to-[#abd8ff]">
        <div className="max-w-8xl mx-auto flex flex-col items-center px-10">
          {/* Title - Center Aligned at Top */}
          <h2
            className="text-6xl font-semibold bg-gradient-to-br from-[#66d6ff] to-[#008cff] bg-clip-text text-transparent pb-16 tracking-tight text-center"
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
          <p className="text-black/80 text-2xl mb-4 font-semibold tracking-[-0.01em] leading-tight">
          No planning. No prioritizing. No wondering what comes next.
          </p>
          <p className="text-black/60 text-2xl font-medium tracking-[-0.01em] leading-tight">
          LifeOS simulates thousands of possible days and delivers one day designed around <br/>who you are and what you need. No decisions required. All that's left is living it.
          </p>
        </div>
      </section>

      {/* Sixth Section - Personal Knowledge Graph (Center Aligned) */}
      <section id="section-6" ref={section6Ref} className="relative w-full bg-black/98" style={{ minHeight: '100vh' }}>

        {/* Black gradient overlay at top of section */}
        <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-black via-black/60 to-transparent pointer-events-none z-20"></div>
        {/* Black gradient overlay at bottom of section */}
        <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-20"></div>

        <div className="max-w-8xl mx-auto px-10 h-full pt-[30vh]">

          <div className="relative flex flex-col items-center justify-center h-full">

            {/* Context Categories - positioned absolutely */}
            <div className="absolute top-1/2 left-[51%] transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div ref={contextCategoriesRef} className="flex flex-col items-start text-left gap-4">
                <div ref={el => categoryItemsRef.current[0] = el} className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#30c8ff] to-[#008cff]" style={{ WebkitMaskImage: `url(/eye.svg)`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url(/eye.svg)`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                  <p className="text-5xl text-white tracking-[-0.01em]">Context</p>
                </div>
                <div ref={el => categoryItemsRef.current[1] = el} className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#30c8ff] to-[#008cff]" style={{ WebkitMaskImage: `url(/home.svg)`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url(/home.svg)`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                  <p className="text-5xl text-white tracking-[-0.01em]">Environment</p>
                </div>
                <div ref={el => categoryItemsRef.current[2] = el} className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#30c8ff] to-[#008cff]" style={{ WebkitMaskImage: `url(/thinking.svg)`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url(/thinking.svg)`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                  <p className="text-5xl text-white tracking-[-0.01em]">Psychology</p>
                </div>
                <div ref={el => categoryItemsRef.current[3] = el} className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#30c8ff] to-[#008cff]" style={{ WebkitMaskImage: `url(/bio.svg)`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url(/bio.svg)`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                  <p className="text-5xl text-white tracking-[-0.01em]">Biometrics</p>
                </div>
                <div ref={el => categoryItemsRef.current[4] = el} className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#30c8ff] to-[#008cff]" style={{ WebkitMaskImage: `url(/relationships.svg)`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url(/relationships.svg)`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                  <p className="text-5xl text-white tracking-[-0.01em]">Relationships</p>
                </div>
                <div ref={el => categoryItemsRef.current[5] = el} className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#30c8ff] to-[#008cff]" style={{ WebkitMaskImage: `url(/conversation.svg)`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url(/conversation.svg)`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                  <p className="text-5xl text-white tracking-[-0.01em]">Communication</p>
                </div>
              </div>
            </div>

            {/* Header, Description, and iPad - positioned absolutely at the same location to overlap */}
            <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center max-w-8xl z-30">
              <h2
                ref={section6HeaderRef}
                className="text-[48pt] leading-none font-medium bg-gradient-to-br from-[#30c8ff] to-[#008cff] bg-clip-text text-transparent mb-3 tracking-tight pb-2"
              >
                Personal<br/>Knowledge Graph
              </h2>
              <p ref={section6DescriptionRef} className="text-white/70 text-lg mb-14 ">
                Your entire life, relationships, preferences, and patterns consolidated in one intelligent archive <br/>that understands context, learns continuously, and anticipates your needs before you do.
              </p>
              <div ref={section6IpadRef} className="justify-center items-start w-[97vh] max-w-[1200px]">
                <img
                  src="/pkg.svg"
                  alt="Personal Knowledge Graph Interface"
                  className="w-full h-auto drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seventh Section - Placeholder */}
      {/* <section className="relative w-full bg-white min-h-screen">
        <div className="max-w-8xl mx-auto px-10 py-20">
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-6xl font-semibold text-black mb-8">
              Placeholder Section
            </h2>
            <p className="text-black/60 text-xl text-center max-w-3xl">
              This is a placeholder section. Add your content here.
            </p>
          </div>
        </div>
      </section> */}

    </div>
  );
}
