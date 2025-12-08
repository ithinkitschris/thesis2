"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export default function OrchestratorVisual({ sectionRef }) {
  const [svgContent, setSvgContent] = useState(null);
  const containerRef = useRef(null);
  const targetProgress = useRef(1); // Raw scroll progress target
  const currentProgress = useRef({ value: 1 }); // Smoothed progress for GSAP

  // Filter IDs for each ring
  const innerRingFilterIds = ['1', '2', '3', '4', '5', '6', '7'];
  const outerRingFilterIds = ['0', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26'];

  useEffect(() => {
    // Load and process SVG
    fetch('/orchestratorvisual.svg')
      .then(res => res.text())
      .then(svg => {
        // Create a temporary DOM to parse the SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        
        if (!svgElement) return;

        // Create wrapper groups for animations
        const innerRingGroup = svgDoc.createElementNS("http://www.w3.org/2000/svg", "g");
        innerRingGroup.setAttribute("class", "inner-ring-group");
        
        const outerRingGroup = svgDoc.createElementNS("http://www.w3.org/2000/svg", "g");
        outerRingGroup.setAttribute("class", "outer-ring-group");

        // Helper function to get circle center from a filter group
        const getCircleCenter = (filterGroup) => {
          const circle = filterGroup.querySelector('circle');
          if (circle) {
            return {
              cx: parseFloat(circle.getAttribute('cx')),
              cy: parseFloat(circle.getAttribute('cy'))
            };
          }
          return null;
        };

        // Helper function to collect elements for a circle group
        const collectCircleElements = (filterGroup) => {
          const elements = [filterGroup];
          let next = filterGroup.nextElementSibling;
          while (next && (next.tagName === 'path' || (next.tagName === 'g' && next.getAttribute('clip-path')))) {
            elements.push(next);
            next = next.nextElementSibling;
          }
          return elements;
        };

        // Process inner ring - wrap each circle group
        innerRingFilterIds.forEach(filterId => {
          const filterGroup = svgElement.querySelector(`g[filter="url(#filter${filterId}_d_583_1273)"]`);
          if (filterGroup) {
            const circleCenter = getCircleCenter(filterGroup);
            const circleElements = collectCircleElements(filterGroup);
            
            // Create wrapper group for counter-rotation
            const wrapperGroup = svgDoc.createElementNS("http://www.w3.org/2000/svg", "g");
            wrapperGroup.setAttribute("class", "inner-ring-circle");
            if (circleCenter) {
              wrapperGroup.setAttribute("style", `transform-origin: ${circleCenter.cx}px ${circleCenter.cy}px`);
            }
            
            // Clone and add all elements to wrapper
            circleElements.forEach(el => {
              const cloned = el.cloneNode(true);
              wrapperGroup.appendChild(cloned);
            });
            
            innerRingGroup.appendChild(wrapperGroup);
            
            // Remove original elements
            circleElements.forEach(el => el.remove());
          }
        });

        // Process outer ring - wrap each circle group
        outerRingFilterIds.forEach(filterId => {
          const filterGroup = svgElement.querySelector(`g[filter="url(#filter${filterId}_d_583_1273)"]`);
          if (filterGroup) {
            const circleCenter = getCircleCenter(filterGroup);
            const circleElements = collectCircleElements(filterGroup);
            
            // Create wrapper group for counter-rotation
            const wrapperGroup = svgDoc.createElementNS("http://www.w3.org/2000/svg", "g");
            wrapperGroup.setAttribute("class", "outer-ring-circle");
            if (circleCenter) {
              wrapperGroup.setAttribute("style", `transform-origin: ${circleCenter.cx}px ${circleCenter.cy}px`);
            }
            
            // Clone and add all elements to wrapper
            circleElements.forEach(el => {
              const cloned = el.cloneNode(true);
              wrapperGroup.appendChild(cloned);
            });
            
            outerRingGroup.appendChild(wrapperGroup);
            
            // Remove original elements
            circleElements.forEach(el => el.remove());
          }
        });

        // Insert animated groups before defs
        const defs = svgElement.querySelector('defs');
        if (defs) {
          if (innerRingGroup.childNodes.length > 0) {
            svgElement.insertBefore(innerRingGroup, defs);
          }
          if (outerRingGroup.childNodes.length > 0) {
            svgElement.insertBefore(outerRingGroup, defs);
          }
        }

        // Get the modified SVG as string
        const serializer = new XMLSerializer();
        const modifiedSvg = serializer.serializeToString(svgElement);
        setSvgContent(modifiedSvg);
      })
      .catch(err => console.error('Error loading SVG:', err));
  }, []);

  // Apply transforms based on progress value
  const applyTransforms = (progress) => {
    if (!containerRef.current) return;

    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    const innerRingRotation = -90 * progress;
    const outerRingRotation = 90 * progress;
    const innerCircleRotation = 90 * progress;
    const outerCircleRotation = -90 * progress;

    const innerRingGroup = svg.querySelector('.inner-ring-group');
    if (innerRingGroup) {
      innerRingGroup.style.transform = `rotate(${innerRingRotation}deg)`;
    }

    const outerRingGroup = svg.querySelector('.outer-ring-group');
    if (outerRingGroup) {
      outerRingGroup.style.transform = `rotate(${outerRingRotation}deg)`;
    }

    const innerCircles = svg.querySelectorAll('.inner-ring-circle');
    innerCircles.forEach(circle => {
      circle.style.transform = `rotate(${innerCircleRotation}deg)`;
    });

    const outerCircles = svg.querySelectorAll('.outer-ring-circle');
    outerCircles.forEach(circle => {
      circle.style.transform = `rotate(${outerCircleRotation}deg)`;
    });
  };

  // Scroll tracking with GSAP-smoothed easing
  useEffect(() => {
    const section = sectionRef?.current;
    if (!section || !svgContent) return;

    // Initialize progress
    currentProgress.current.value = 1;
    targetProgress.current = 1;
    applyTransforms(1);

    const calculateProgress = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Animation starts when section top is at 70% of viewport height (enters from bottom)
      // Animation ends when section top is 30% of viewport height above the top (negative = past top)
      const startPoint = windowHeight * 0.7;
      const endPoint = windowHeight * -0.1;
      const scrollRange = startPoint - endPoint;

      const rawProgress = Math.max(0, Math.min(1, (rect.top - endPoint) / scrollRange));

      // Update target and tween towards it
      targetProgress.current = rawProgress;

      gsap.to(currentProgress.current, {
        value: rawProgress,
        duration: 0.8,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => {
          applyTransforms(currentProgress.current.value);
        }
      });
    };

    calculateProgress();

    let scrollHandler = null;
    let resizeHandler = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            scrollHandler = () => calculateProgress();
            resizeHandler = () => calculateProgress();
            window.addEventListener('scroll', scrollHandler, { passive: true });
            window.addEventListener('resize', resizeHandler, { passive: true });
            calculateProgress();
          } else {
            if (scrollHandler) {
              window.removeEventListener('scroll', scrollHandler);
              scrollHandler = null;
            }
            if (resizeHandler) {
              window.removeEventListener('resize', resizeHandler);
              resizeHandler = null;
            }
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      gsap.killTweensOf(currentProgress.current);
    };
  }, [sectionRef, svgContent]);

  return (
    <>
      <style jsx global>{`
        .orchestrator-svg .inner-ring-group {
          transform-origin: 336.301px 333.431px;
          will-change: transform;
        }

        .orchestrator-svg .outer-ring-group {
          transform-origin: 336.301px 333.431px;
          will-change: transform;
        }

        .orchestrator-svg .inner-ring-circle {
          will-change: transform;
        }

        .orchestrator-svg .outer-ring-circle {
          will-change: transform;
        }
      `}</style>
      <div
        ref={containerRef}
        className="orchestrator-svg w-full h-auto"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </>
  );
}
