"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const [appMethodApproach, setAppMethodApproach] = useState("");
  const [primaryActivityGoal, setPrimaryActivityGoal] = useState("");
  const [motivationNeed, setMotivationNeed] = useState("");
  const [positiveAspects, setPositiveAspects] = useState("");
  const [frictionPoints, setFrictionPoints] = useState("");
  const [emotionalOutcome, setEmotionalOutcome] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Refs for inputs and hidden spans for measuring text width
  const inputRefs = {
    appMethodApproach: useRef(null),
    primaryActivityGoal: useRef(null),
    motivationNeed: useRef(null),
    positiveAspects: useRef(null),
    frictionPoints: useRef(null),
    emotionalOutcome: useRef(null),
  };

  const measureRefs = {
    appMethodApproach: useRef(null),
    primaryActivityGoal: useRef(null),
    motivationNeed: useRef(null),
    positiveAspects: useRef(null),
    frictionPoints: useRef(null),
    emotionalOutcome: useRef(null),
  };

  // Store minimum widths (placeholder widths) for each input
  const minWidths = useRef({
    appMethodApproach: null,
    primaryActivityGoal: null,
    motivationNeed: null,
    positiveAspects: null,
    frictionPoints: null,
    emotionalOutcome: null,
  });

  // Function to get placeholder width
  const getPlaceholderWidth = (inputRef, measureRef) => {
    if (measureRef.current && inputRef.current) {
      const placeholder = inputRef.current.placeholder || "";
      measureRef.current.textContent = placeholder;
      return measureRef.current.offsetWidth;
    }
    return 100; // fallback
  };

  // Function to auto-resize textarea height
  const autoResizeTextarea = (textareaRef) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Function to update input width based on content
  const updateInputWidth = (inputRef, measureRef, value, fieldName) => {
    if (measureRef.current && inputRef.current) {
      const text = value || "";
      const placeholder = inputRef.current.placeholder || "";
      
      // For textarea, measure the longest line
      if (inputRef.current.tagName === 'TEXTAREA') {
        const lines = text ? text.split('\n') : [];
        let maxWidth = 0;
        
        // If no text, measure placeholder
        if (!text || lines.length === 0 || (lines.length === 1 && !lines[0])) {
          measureRef.current.textContent = placeholder;
          maxWidth = measureRef.current.offsetWidth;
        } else {
          // Measure each line, using placeholder for empty lines
          lines.forEach(line => {
            measureRef.current.textContent = line || placeholder;
            const width = measureRef.current.offsetWidth;
            maxWidth = Math.max(maxWidth, width);
          });
        }
        
        const minWidth = minWidths.current[fieldName] || 100;
        // For positiveAspects and frictionPoints, allow wrapping by setting max-width based on container
        if (fieldName === 'positiveAspects' || fieldName === 'frictionPoints') {
          // Get the paragraph container width (go up to <p> element)
          let container = inputRef.current.parentElement;
          while (container && container.tagName !== 'P') {
            container = container.parentElement;
          }
          const containerWidth = container?.offsetWidth || window.innerWidth - 200; // Fallback to viewport width minus margins
          const maxAllowedWidth = Math.max(containerWidth - 150, minWidth); // Leave margin for padding/spacing
          inputRef.current.style.width = `${Math.min(Math.max(minWidth, maxWidth), maxAllowedWidth)}px`;
          inputRef.current.style.maxWidth = `${maxAllowedWidth}px`;
        } else {
          inputRef.current.style.width = `${Math.max(minWidth, maxWidth)}px`;
        }
        
        // Auto-resize height for textareas
        autoResizeTextarea(inputRef);
      } else {
        // For regular inputs, use placeholder if empty
        const measureText = text || placeholder;
        measureRef.current.textContent = measureText;
        const width = measureRef.current.offsetWidth;
        const minWidth = minWidths.current[fieldName] || 100;
        inputRef.current.style.width = `${Math.max(minWidth, width)}px`;
      }
    }
  };

  // Initialize widths on mount
  useEffect(() => {
    // Small delay to ensure refs are attached
    const timer = setTimeout(() => {
      // Calculate and store placeholder widths
      minWidths.current.appMethodApproach = getPlaceholderWidth(inputRefs.appMethodApproach, measureRefs.appMethodApproach);
      minWidths.current.primaryActivityGoal = getPlaceholderWidth(inputRefs.primaryActivityGoal, measureRefs.primaryActivityGoal);
      minWidths.current.motivationNeed = getPlaceholderWidth(inputRefs.motivationNeed, measureRefs.motivationNeed);
      minWidths.current.positiveAspects = getPlaceholderWidth(inputRefs.positiveAspects, measureRefs.positiveAspects);
      minWidths.current.frictionPoints = getPlaceholderWidth(inputRefs.frictionPoints, measureRefs.frictionPoints);
      minWidths.current.emotionalOutcome = getPlaceholderWidth(inputRefs.emotionalOutcome, measureRefs.emotionalOutcome);

      // Set initial widths based on placeholder
      updateInputWidth(inputRefs.appMethodApproach, measureRefs.appMethodApproach, appMethodApproach, 'appMethodApproach');
      updateInputWidth(inputRefs.primaryActivityGoal, measureRefs.primaryActivityGoal, primaryActivityGoal, 'primaryActivityGoal');
      updateInputWidth(inputRefs.motivationNeed, measureRefs.motivationNeed, motivationNeed, 'motivationNeed');
      updateInputWidth(inputRefs.positiveAspects, measureRefs.positiveAspects, positiveAspects, 'positiveAspects');
      updateInputWidth(inputRefs.frictionPoints, measureRefs.frictionPoints, frictionPoints, 'frictionPoints');
      updateInputWidth(inputRefs.emotionalOutcome, measureRefs.emotionalOutcome, emotionalOutcome, 'emotionalOutcome');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Update widths when values change
  useEffect(() => {
    updateInputWidth(inputRefs.appMethodApproach, measureRefs.appMethodApproach, appMethodApproach, 'appMethodApproach');
  }, [appMethodApproach]);

  useEffect(() => {
    updateInputWidth(inputRefs.primaryActivityGoal, measureRefs.primaryActivityGoal, primaryActivityGoal, 'primaryActivityGoal');
  }, [primaryActivityGoal]);

  useEffect(() => {
    updateInputWidth(inputRefs.motivationNeed, measureRefs.motivationNeed, motivationNeed, 'motivationNeed');
  }, [motivationNeed]);

  useEffect(() => {
    updateInputWidth(inputRefs.positiveAspects, measureRefs.positiveAspects, positiveAspects, 'positiveAspects');
  }, [positiveAspects]);

  // Handle window resize for positiveAspects textarea
  useEffect(() => {
    const handleResize = () => {
      if (inputRefs.positiveAspects.current && inputRefs.positiveAspects.current.tagName === 'TEXTAREA') {
        updateInputWidth(inputRefs.positiveAspects, measureRefs.positiveAspects, positiveAspects, 'positiveAspects');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [positiveAspects]);

  useEffect(() => {
    updateInputWidth(inputRefs.frictionPoints, measureRefs.frictionPoints, frictionPoints, 'frictionPoints');
  }, [frictionPoints]);

  // Handle window resize for frictionPoints textarea
  useEffect(() => {
    const handleResize = () => {
      if (inputRefs.frictionPoints.current && inputRefs.frictionPoints.current.tagName === 'TEXTAREA') {
        updateInputWidth(inputRefs.frictionPoints, measureRefs.frictionPoints, frictionPoints, 'frictionPoints');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [frictionPoints]);

  useEffect(() => {
    updateInputWidth(inputRefs.emotionalOutcome, measureRefs.emotionalOutcome, emotionalOutcome, 'emotionalOutcome');
  }, [emotionalOutcome]);

  const handleGenerate = async () => {
    if (!appMethodApproach.trim() || !primaryActivityGoal.trim()) {
      return;
    }

    setIsLoading(true);
    setOutput("");

    const filledPrompt = `I use ${appMethodApproach} to ${primaryActivityGoal}${motivationNeed ? ` I do this because ${motivationNeed}` : ""}${positiveAspects ? ` What I like about it is ${positiveAspects},` : ""}${frictionPoints ? ` but what's frustrating or takes effort is ${frictionPoints}` : ""}${emotionalOutcome ? ` The whole thing makes me feel ${emotionalOutcome}` : ""}`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: filledPrompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.result);
      } else {
        setOutput("Error: Failed to generate response. Please try again.");
      }
    } catch (error) {
      setOutput("Error: Failed to generate response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-8 py-16">
      <main className="w-full max-w-4xl text-center">
        {/* <h1 className="text-7xl tracking-[-0.02em] font-medium mb-12">
          Bargaining with the Future.
        </h1> */}

        <div className="space-y-10 mb-8">
          <div className="text-4xl font-semibold text-black/90 tracking-[-0.01em] text-left max-w-3xl mx-auto space-y-2">
            <p>
              I use{" "}
              <span className="relative inline-block focus-within:mx-1 transition-all duration-200">
                <span
                  ref={measureRefs.appMethodApproach}
                  className="invisible absolute whitespace-pre px-2 text-xl"
                  style={{ font: 'inherit' }}
                />
                <input
                  ref={inputRefs.appMethodApproach}
                  type="text"
                  value={appMethodApproach}
                  onChange={(e) => {
                    setAppMethodApproach(e.target.value);
                    updateInputWidth(inputRefs.appMethodApproach, measureRefs.appMethodApproach, e.target.value, 'appMethodApproach');
                  }}
                  placeholder="Instagram"
                  className="inline-block border-b-2 text-black/90 border-black/20 bg-transparent px-2 py-1 focus:outline-none focus:border-black/50 placeholder:text-black/20 placeholder:font-medium focus:placeholder:text-black/3 transition-all duration-200 focus:scale-102 origin-center"
                />
              </span>{" "}
              to{" "}
              <span className="relative inline-block focus-within:mx-1 transition-all duration-200">
                <span
                  ref={measureRefs.primaryActivityGoal}
                  className="invisible absolute whitespace-pre px-2 text-xl"
                  style={{ font: 'inherit' }}
                />
                <input
                  ref={inputRefs.primaryActivityGoal}
                  type="text"
                  value={primaryActivityGoal}
                  onChange={(e) => {
                    setPrimaryActivityGoal(e.target.value);
                    updateInputWidth(inputRefs.primaryActivityGoal, measureRefs.primaryActivityGoal, e.target.value, 'primaryActivityGoal');
                  }}
                  placeholder="check in on my friends"
                  className="inline-block border-b-2 text-black/90 border-black/20 bg-transparent px-2 py-1 focus:outline-none focus:border-black/50 placeholder:text-black/20 placeholder:font-medium focus:placeholder:text-black/3 transition-all duration-200 focus:scale-102 origin-center"
                />
              </span>
            </p>
            <p>
              I do this because{" "}
              <span className="relative inline-block focus-within:mx-1 transition-all duration-200">
                <span
                  ref={measureRefs.motivationNeed}
                  className="invisible absolute whitespace-pre px-2 text-xl"
                  style={{ font: 'inherit' }}
                />
                <input
                  ref={inputRefs.motivationNeed}
                  type="text"
                  value={motivationNeed}
                  onChange={(e) => {
                    setMotivationNeed(e.target.value);
                    updateInputWidth(inputRefs.motivationNeed, measureRefs.motivationNeed, e.target.value, 'motivationNeed');
                  }}
                  placeholder="I am bored"
                  className="inline-block border-b-2 text-black/90 border-black/20 bg-transparent px-2 py-1 focus:outline-none focus:border-black/50 placeholder:text-black/20 placeholder:font-medium focus:placeholder:text-black/3 transition-all duration-200 focus:scale-102 origin-center"
                />
              </span>
            </p>
            <p>
              What I like about it is{" "}
              <span className="relative inline-block focus-within:mx-1 transition-all duration-200">
                <span
                  ref={measureRefs.positiveAspects}
                  className="invisible absolute whitespace-pre px-2 text-xl"
                  style={{ font: 'inherit' }}
                />
                <textarea
                  ref={inputRefs.positiveAspects}
                  value={positiveAspects}
                  onChange={(e) => {
                    setPositiveAspects(e.target.value);
                    updateInputWidth(inputRefs.positiveAspects, measureRefs.positiveAspects, e.target.value, 'positiveAspects');
                  }}
                  placeholder="it helps me feel connected"
                  rows={1}
                  className="inline-block align-baseline border-b-2 text-black/90 border-black/20 bg-transparent px-2 py-1 focus:outline-none focus:border-black/50 resize-none overflow-hidden placeholder:text-black/20 placeholder:font-medium focus:placeholder:text-black/3 transition-all duration-200 focus:scale-[1.02] origin-left"
                  style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                />
              </span>
            </p>
            <p>
              But what's frustrating is{" "}
              <span className="relative inline-block focus-within:mx-1 transition-all duration-200">
                <span
                  ref={measureRefs.frictionPoints}
                  className="invisible absolute whitespace-pre px-2 text-xl"
                  style={{ font: 'inherit' }}
                />
                <textarea
                  ref={inputRefs.frictionPoints}
                  value={frictionPoints}
                  onChange={(e) => {
                    setFrictionPoints(e.target.value);
                    updateInputWidth(inputRefs.frictionPoints, measureRefs.frictionPoints, e.target.value, 'frictionPoints');
                  }}
                  placeholder="I end up doomscrolling on corgi reels  "
                  rows={1}
                  className="inline-block align-baseline border-b-2 text-black/90 border-black/20 bg-transparent px-2 py-1 focus:outline-none focus:border-black/50 resize-none overflow-hidden placeholder:text-black/20 placeholder:font-medium focus:placeholder:text-black/3 transition-all duration-200 focus:scale-102 origin-center"
                  style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                />
              </span>
            </p>
            <p>
              The whole thing makes me feel{" "}
              <span className="relative inline-block focus-within:mx-1 transition-all duration-200">
                <span
                  ref={measureRefs.emotionalOutcome}
                  className="invisible absolute whitespace-pre px-2 text-xl"
                  style={{ font: 'inherit' }}
                />
                <input
                  ref={inputRefs.emotionalOutcome}
                  type="text"
                  value={emotionalOutcome}
                  onChange={(e) => {
                    setEmotionalOutcome(e.target.value);
                    updateInputWidth(inputRefs.emotionalOutcome, measureRefs.emotionalOutcome, e.target.value, 'emotionalOutcome');
                  }}
                  placeholder="dystopian, man"
                  className="inline-block border-b-2 text-black/90 border-black/20 bg-transparent px-2 py-1 focus:outline-none focus:border-black/50 placeholder:text-black/20 placeholder:font-medium focus:placeholder:text-black/3 transition-all duration-200 focus:scale-102 origin-center"
                />
              </span>
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!appMethodApproach.trim() || !primaryActivityGoal.trim()}
            className="px-6 py-2.5 border-2 border-black/20 text-black/90 rounded-full font-medium hover:bg-black/80 hover:text-white hover:scale-95 disabled:opacity-0 disabled:scale-90 transition-all duration-100 cursor-pointer disabled:cursor-none"
          >
            {isLoading ? "Generating..." : "What is this?"}
          </button>
        </div>

        <AnimatePresence>
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="markdown-content mt-28"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {output}
              </ReactMarkdown>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
