"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import OrchestratorVisual from "./components/OrchestratorVisual";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

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
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

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

  const toggleVideoPlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Sync video state with actual playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

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

    // Configuration - single source of truth for all animation values
    const CONFIG = {
      phases: {
        categoryTransition: { start: 0, end: 0.6, duration: 0.12, count: 5 },
        fadeOut: { start: 0.6, end: 0.7 },
        contentReveal: { start: 0.7, end: 1.0 }
      },
      container: {
        initialScale: 1.5,
        finalScale: 1,
        scaleEndProgress: 0.8,
        yEndPosition: -325,
        yEndProgress: 0.6
      },
      opacity: { active: 1, inactive: 0.25, hidden: 0 },
      contentReveal: {
        header: { start: 0.65, end: 0.85 },
        description: { start: 0.2, end: 0.7 },
        ipad: { start: 0.4, end: 1.0 }
      },
      easing: {
        categoryTransition: "power3.inOut",
        scale: "power1.inOut",
        contentReveal: "power3.out"
      },
      contentOffset: { y: 50 }
    };

    // Cache easing functions for better performance
    const easingCache = {
      categoryTransition: gsap.parseEase(CONFIG.easing.categoryTransition),
      scale: gsap.parseEase(CONFIG.easing.scale),
      contentReveal: gsap.parseEase(CONFIG.easing.contentReveal)
    };

    // Helper function to normalize progress within a range
    const getNormalizedProgress = (progress, start, end) => {
      if (progress < start) return 0;
      if (progress > end) return 1;
      return (progress - start) / (end - start);
    };

    // Helper function to get eased value using cached easing
    const getEasedValue = (progress, easeType) => {
      return easingCache[easeType](progress);
    };

    // Calculate container scale based on progress
    const getContainerScale = (progress) => {
      const scaleProgress = Math.min(1, progress / CONFIG.container.scaleEndProgress);
      const scaleEased = getEasedValue(scaleProgress, 'scale');
      return CONFIG.container.initialScale - 
        ((CONFIG.container.initialScale - CONFIG.container.finalScale) * scaleEased);
    };

    // Calculate container Y position based on progress
    const getContainerY = (progress) => {
      if (progress <= CONFIG.container.yEndProgress) {
        return CONFIG.container.yEndPosition * (progress / CONFIG.container.yEndProgress);
      }
      return CONFIG.container.yEndPosition;
    };

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.id === 'categories-scroll') {
        trigger.kill();
      }
    });

    // Set initial states
    gsap.set(contextCategoriesRef.current, { 
      y: 0, 
      scale: CONFIG.container.initialScale 
    });
    gsap.set(items[0], { opacity: CONFIG.opacity.active });
    items.slice(1).forEach(item => {
      gsap.set(item, { opacity: CONFIG.opacity.inactive });
    });
    gsap.set(section6HeaderRef.current, { 
      opacity: 0, 
      y: CONFIG.contentOffset.y 
    });
    gsap.set(section6DescriptionRef.current, { 
      opacity: 0, 
      y: CONFIG.contentOffset.y 
    });
    gsap.set(section6IpadRef.current, { 
      opacity: 0, 
      y: CONFIG.contentOffset.y 
    });

    // Main animation update function
    const updateAnimation = (progress) => {
      const containerY = getContainerY(progress);
      const containerScale = getContainerScale(progress);
      const phaseDuration = CONFIG.phases.categoryTransition.duration;
      const phaseIndex = Math.floor(progress / phaseDuration);
      const maxPhase = CONFIG.phases.categoryTransition.count - 1;

      // Category transition phases (0-60%)
      if (progress <= CONFIG.phases.categoryTransition.end && phaseIndex <= maxPhase) {
        const phaseStart = phaseIndex * phaseDuration;
        const phaseProgress = getNormalizedProgress(
          progress,
          phaseStart,
          phaseStart + phaseDuration
        );
        const easedProgress = getEasedValue(phaseProgress, 'categoryTransition');
        const fromIndex = phaseIndex;
        const toIndex = phaseIndex + 1;

        // Update container
        gsap.set(contextCategoriesRef.current, {
          y: containerY,
          scale: containerScale
        });

        // Update items - fade from one to next
        items.forEach((item, index) => {
          if (index < fromIndex || index > toIndex) {
            gsap.set(item, { opacity: CONFIG.opacity.inactive });
          } else if (index === fromIndex) {
            gsap.set(item, { 
              opacity: CONFIG.opacity.active - 
                ((CONFIG.opacity.active - CONFIG.opacity.inactive) * easedProgress) 
            });
          } else if (index === toIndex) {
            gsap.set(item, { 
              opacity: CONFIG.opacity.inactive + 
                ((CONFIG.opacity.active - CONFIG.opacity.inactive) * easedProgress) 
            });
          }
        });

        // Hide content elements
        gsap.set(section6HeaderRef.current, { 
          opacity: 0, 
          y: CONFIG.contentOffset.y 
        });
        gsap.set(section6DescriptionRef.current, { 
          opacity: 0, 
          y: CONFIG.contentOffset.y 
        });
        gsap.set(section6IpadRef.current, { 
          opacity: 0, 
          y: CONFIG.contentOffset.y 
        });
      }
      // Fade out phase (60-70%)
      else if (progress <= CONFIG.phases.fadeOut.end) {
        const fadeProgress = getNormalizedProgress(
          progress,
          CONFIG.phases.fadeOut.start,
          CONFIG.phases.fadeOut.end
        );
        const easedProgress = getEasedValue(fadeProgress, 'categoryTransition');

        // Fade out all category items
        items.forEach(item => {
          gsap.set(item, { 
            opacity: CONFIG.opacity.inactive - (CONFIG.opacity.inactive * easedProgress) 
          });
        });
        gsap.set(contextCategoriesRef.current, {
          opacity: 1 - easedProgress,
          scale: CONFIG.container.finalScale,
          y: containerY
        });

        // Start header animation (overlaps with fade out)
        if (progress >= CONFIG.contentReveal.header.start) {
          const headerProgress = getNormalizedProgress(
            progress,
            CONFIG.contentReveal.header.start,
            CONFIG.contentReveal.header.end
          );
          const headerEased = getEasedValue(headerProgress, 'contentReveal');
          gsap.set(section6HeaderRef.current, {
            opacity: headerEased,
            y: CONFIG.contentOffset.y - (CONFIG.contentOffset.y * headerEased)
          });
        } else {
          gsap.set(section6HeaderRef.current, { 
            opacity: 0, 
            y: CONFIG.contentOffset.y 
          });
        }

        // Keep description and iPad hidden
        gsap.set(section6DescriptionRef.current, { 
          opacity: 0, 
          y: CONFIG.contentOffset.y 
        });
        gsap.set(section6IpadRef.current, { 
          opacity: 0, 
          y: CONFIG.contentOffset.y 
        });
      }
      // Content reveal phase (70-100%)
      else {
        // Hide categories completely
        items.forEach(item => gsap.set(item, { opacity: CONFIG.opacity.hidden }));
        gsap.set(contextCategoriesRef.current, {
          opacity: CONFIG.opacity.hidden,
          scale: CONFIG.container.finalScale,
          y: containerY
        });

        // Calculate phase 6 progress (0-1 within content reveal phase)
        const phase6Progress = getNormalizedProgress(
          progress,
          CONFIG.phases.contentReveal.start,
          CONFIG.phases.contentReveal.end
        );

        // Header (continues from fade out phase)
        const headerProgress = getNormalizedProgress(
          progress,
          CONFIG.contentReveal.header.start,
          CONFIG.contentReveal.header.end
        );
        const headerEased = getEasedValue(headerProgress, 'contentReveal');
        gsap.set(section6HeaderRef.current, {
          opacity: headerEased,
          y: CONFIG.contentOffset.y - (CONFIG.contentOffset.y * headerEased)
        });

        // Description (starts at 20% of phase 6)
        if (phase6Progress >= CONFIG.contentReveal.description.start) {
          const descProgress = getNormalizedProgress(
            phase6Progress,
            CONFIG.contentReveal.description.start,
            CONFIG.contentReveal.description.end
          );
          const descEased = getEasedValue(descProgress, 'contentReveal');
          gsap.set(section6DescriptionRef.current, {
            opacity: descEased,
            y: CONFIG.contentOffset.y - (CONFIG.contentOffset.y * descEased)
          });
        }

        // iPad (starts at 40% of phase 6)
        if (phase6Progress >= CONFIG.contentReveal.ipad.start) {
          const ipadProgress = getNormalizedProgress(
            phase6Progress,
            CONFIG.contentReveal.ipad.start,
            CONFIG.contentReveal.ipad.end
          );
          const ipadEased = getEasedValue(ipadProgress, 'contentReveal');
          gsap.set(section6IpadRef.current, {
            opacity: ipadEased,
            y: CONFIG.contentOffset.y - (CONFIG.contentOffset.y * ipadEased)
          });
        }
      }
    };

    // Create ScrollTrigger
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
      onUpdate: (self) => updateAnimation(self.progress)
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
      <section className="relative w-full h-screen overflow-hidden bg-white">
        {/* Background Video */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute h-[106.83%] left-[-9.48%] max-w-none top-[-0.62%] w-[117.71%] object-cover opacity-90"
          >
            <source src="/lifeoscover.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 pointer-events-none z-[2]"></div>

        {/* Logo and Slogan */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-8">
          {/* LifeOS Logo */}
          <div className="-mt-16 mb-6">
            <img
              alt="LifeOS Logo"
              src="/lifeoswhite.svg"
              className="h-12 w-auto drop-shadow-lg"
            />
          </div>
          <div className="text-white tracking-tight">
            <p className="text-5xl md:text-7xl font-normal mb-2 leading-tight">The human spirit.</p>
            <p className="text-5xl md:text-7xl font-light leading-tight">Optimized.</p>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={toggleVideoPlayPause}
          className="absolute bottom-8 right-8 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-100 flex items-center justify-center cursor-pointer"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </section>

      {/* Second Section - Stop Thinking Start Living */}
      <section className="relative w-full bg-[#F0F2F5] pt-24 pb-32 px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Text Content */}
          <div className="text-center mb-16">
            <div className="mb-6 flex justify-center">
              <img
                alt="LifeOS Logo"
                src="/lifeosbadlogo.svg"
                className="h-16 w-auto"
              />
            </div>
            <h2 className="text-5xl md:text-6xl font-normal text-[#1C1E21] mb-4 leading-tight tracking-tight">
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
          <div className="text-center mt-20 w-full max-w-3xl mx-auto">
            <h3 className="text-[#1C1E21] text-3xl mb-4 font-normal leading-tight">
              Meet the world's first fully agentic operating system.
            </h3>
            <p className="text-[#65676B] text-lg font-normal leading-relaxed mb-2">
              LifeOS anticipates what you need, acts on your behalf, and quietly handles the thousands of small decisions that used to fill your day.
            </p>
            <p className="text-[#65676B] text-lg font-normal leading-relaxed mb-8">
              Less screen time. Less decision fatigue. More you.
            </p>

            <Link
              href="/testimonials"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-none text-white text-base font-medium transition-all duration-100 hover:bg-[#1B74E4] active:scale-95"
              style={{
                backgroundColor: '#1877F2',
                minHeight: '40px'
              }}
            >
              Now in Beta
            </Link>
          </div>
        </div>
      </section>

      {/* Third Section - Carousel */}
      <section className="relative w-full py-16 mb-20 overflow-hidden bg-white">

        {/* Section Title and Navigation Arrows */}
        <div className="px-8 max-w-8xl mx-auto">

          <div className="flex items-end justify-between mt-4 mb-12 pl-12">

            {/* Header */}
            <h2 className="text-5xl leading-tight font-normal tracking-tight text-[#1C1E21]">
              Intelligence that <br/>finally works for you.
            </h2>

            {/* Navigation Arrows */}
            <div className="flex gap-2">
              <button
                onClick={handlePrevSlide}
                className={`w-10 h-10 rounded-lg bg-[#E4E6EB] hover:bg-[#D8DADF] transition-all duration-100 flex items-center justify-center ${isAtStart ? 'opacity-40' : ''}`}
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5 mr-0.5 text-[#050505]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextSlide}
                className={`w-10 h-10 rounded-lg bg-[#E4E6EB] hover:bg-[#D8DADF] transition-all duration-100 flex items-center justify-center ${isAtEnd ? 'opacity-40' : ''}`}
                aria-label="Next slide"
              >
                <svg className="w-5 h-5 ml-0.5 text-[#050505]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>

        </div>

        {/* Carousel Container - extends beyond viewport */}
        <div className="relative pl-12 max-w-8xl mx-auto">
          {/* Carousel Items */}
          <div ref={carouselRef} className="flex gap-6 overflow-x-scroll snap-x snap-mandatory pb-8 pr-8"
               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {carouselItems.map((item, index) => (
              <div
                key={index}
                className="snap-start flex-shrink-0"
                style={{ width: '360px' }}
              >
                {/* Card */}
                <div className="overflow-hidden h-full bg-white rounded-2xl shadow-sm border border-[#E4E6EB]">
                  {/* Image */}
                  <div className={`aspect-[3.5/4.8] rounded-t-2xl overflow-hidden flex items-center justify-center ${
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
                      : 'bg-[#F0F2F5]'
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
                  <div className="p-5 bg-white">
                    <h3 className="text-[#1C1E21] text-xl font-medium mb-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[#65676B] text-base font-normal leading-relaxed">
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
      <section ref={orchestratorSectionRef} className="relative w-full pt-16 pb-32 bg-[#F0F2F5]">
        <div className="max-w-8xl mx-auto flex flex-col items-center px-10">

          {/* Header */}
          <div className="text-center max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-normal mb-32 tracking-tight text-[#1C1E21] leading-tight">
              Finite life.
              <br />
              Infinite coordination.
            </h2>
          </div>

          {/* Orchestrator visual with orbiting animation */}
          <div className="flex justify-center">
            <div className="w-full h-auto max-w-7xl scale-115" style={{ filter: 'drop-shadow(0 12px 28px rgba(0, 0, 0, 0.08))' }}>
              <OrchestratorVisual sectionRef={orchestratorSectionRef} />
            </div>
          </div>

          {/* Description */}
          <div className="text-center max-w-3xl mt-28">
            <h3 className="text-[#1C1E21] text-3xl mb-4 font-normal leading-tight">
              Meet the Orchestrator.
            </h3>
            <p className="text-[#65676B] text-xl font-normal leading-relaxed">
              Anticipating what you need, coordinating every subsystem, and executing decisions across every domain of your life. The Orchestrator handles life's complexity while keeping yours beautifully simple.
            </p>
          </div>
        </div>
      </section>

      {/* Fifth Section - Personal Knowledge Graph */}
      <section className="relative w-full pt-24 pb-32 bg-white">
        <div className="max-w-8xl mx-auto flex flex-col items-center px-10">
          {/* Title - Center Aligned at Top */}
          <h2 className="text-5xl md:text-6xl font-normal text-[#1C1E21] pb-16 tracking-tight text-center leading-tight">
            Wake up to a day <br /> that's already solved.
          </h2>

          {/* iPad Image */}
          <div className="flex justify-center mb-16">
            <img
              src="/day.png"
              alt="Personal Knowledge Graph Interface"
              className="w-full h-auto max-w-4xl scale-110"
              style={{ filter: 'drop-shadow(0 12px 28px rgba(0, 0, 0, 0.15))' }}
            />
          </div>

          {/* Description Below iPad */}
          <div className="text-center max-w-3xl">
            <p className="text-[#1C1E21] text-2xl mb-3 font-normal leading-tight">
              No planning. No prioritizing. No wondering what comes next.
            </p>
            <p className="text-[#65676B] text-lg font-normal leading-relaxed">
              LifeOS simulates thousands of possible days and delivers one day designed around who you are and what you need. No decisions required. All that's left is living it.
            </p>
          </div>
        </div>
      </section>

      {/* Sixth Section - Personal Knowledge Graph (Center Aligned) */}
      <section id="section-6" ref={section6Ref} className="relative w-full bg-[#1C1E21]" style={{ minHeight: '100vh' }}>

        {/* Gradient overlay at top of section */}
        <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-[#1C1E21] via-[#1C1E21]/60 to-transparent pointer-events-none z-20"></div>
        {/* Gradient overlay at bottom of section */}
        <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-[#1C1E21] via-[#1C1E21]/60 to-transparent pointer-events-none z-20"></div>

        <div className="max-w-8xl mx-auto px-10 h-full pt-[30vh]">

          <div className="relative flex flex-col items-center justify-center h-full">

            {/* Context Categories - positioned absolutely */}
            <div className="absolute top-1/2 left-[51%] transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div ref={contextCategoriesRef} className="flex flex-col items-start text-left gap-4">
                <div ref={el => categoryItemsRef.current[0] = el} className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-[#1877F2]" style={{ WebkitMaskImage: `url(/eye.svg)`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url(/eye.svg)`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                  <p className="text-5xl text-white font-light">Context</p>
                </div>
                <div ref={el => categoryItemsRef.current[1] = el} className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-[#1877F2]" style={{ WebkitMaskImage: `url(/home.svg)`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url(/home.svg)`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                  <p className="text-5xl text-white font-light">Environment</p>
                </div>
                <div ref={el => categoryItemsRef.current[2] = el} className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-[#1877F2]" style={{ WebkitMaskImage: `url(/thinking.svg)`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url(/thinking.svg)`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                  <p className="text-5xl text-white font-light">Psychology</p>
                </div>
                <div ref={el => categoryItemsRef.current[3] = el} className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-[#1877F2]" style={{ WebkitMaskImage: `url(/bio.svg)`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url(/bio.svg)`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                  <p className="text-5xl text-white font-light">Biometrics</p>
                </div>
                <div ref={el => categoryItemsRef.current[4] = el} className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-[#1877F2]" style={{ WebkitMaskImage: `url(/relationships.svg)`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url(/relationships.svg)`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                  <p className="text-5xl text-white font-light">Relationships</p>
                </div>
                <div ref={el => categoryItemsRef.current[5] = el} className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-[#1877F2]" style={{ WebkitMaskImage: `url(/conversation.svg)`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: `url(/conversation.svg)`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                  <p className="text-5xl text-white font-light">Communication</p>
                </div>
              </div>
            </div>

            {/* Header, Description, and iPad - positioned absolutely at the same location to overlap */}
            <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center max-w-8xl z-30">
              <h2
                ref={section6HeaderRef}
                className="text-5xl md:text-6xl leading-tight font-normal text-white mb-4 tracking-tight"
              >
                Personal<br/>Knowledge Graph
              </h2>
              <p ref={section6DescriptionRef} className="text-white/80 text-lg mb-14 font-normal leading-relaxed max-w-3xl">
                Your entire life, relationships, preferences, and patterns consolidated in one intelligent archive that understands context, learns continuously, and anticipates your needs before you do.
              </p>
              <div ref={section6IpadRef} className="justify-center items-start w-[97vh] max-w-[1200px]">
                <img
                  src="/pkg.svg"
                  alt="Personal Knowledge Graph Interface"
                  className="w-full h-auto"
                  style={{ filter: 'drop-shadow(0 12px 28px rgba(0, 0, 0, 0.3))' }}
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
