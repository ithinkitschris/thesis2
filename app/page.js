"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [appMethodApproach, setAppMethodApproach] = useState("");
  const [primaryActivityGoal, setPrimaryActivityGoal] = useState("");
  const [motivationNeed, setMotivationNeed] = useState("");
  const [positiveAspects, setPositiveAspects] = useState("");
  const [frictionPoints, setFrictionPoints] = useState("");
  const [emotionalOutcome, setEmotionalOutcome] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!appMethodApproach.trim() || !primaryActivityGoal.trim()) {
      return;
    }

    setIsLoading(true);
    setOutput("");

    const filledPrompt = `I use ${appMethodApproach} to ${primaryActivityGoal}.${motivationNeed ? ` I do this because ${motivationNeed}.` : ""}${positiveAspects ? ` What I like about it is ${positiveAspects},` : ""}${frictionPoints ? ` but what's frustrating or takes effort is ${frictionPoints}.` : ""}${emotionalOutcome ? ` The whole thing makes me feel ${emotionalOutcome}.` : ""}`;

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

        <div className="space-y-6 mb-8">
          <div className="text-xl leading-relaxed text-left max-w-3xl mx-auto space-y-4">
            <p>
              I use{" "}
              <input
                type="text"
                value={appMethodApproach}
                onChange={(e) => setAppMethodApproach(e.target.value)}
                placeholder="Instagram"
                className="inline-block border-b-2 border-gray-400 bg-transparent px-2 py-1 min-w-[200px] focus:outline-none focus:border-gray-700"
              />{" "}
              to{" "}
              <input
                type="text"
                value={primaryActivityGoal}
                onChange={(e) => setPrimaryActivityGoal(e.target.value)}
                placeholder="check in on my friends"
                className="inline-block border-b-2 border-gray-400 bg-transparent px-2 py-1 min-w-[200px] focus:outline-none focus:border-gray-700"
              />.
            </p>
            <p>
              I do this because{" "}
              <input
                type="text"
                value={motivationNeed}
                onChange={(e) => setMotivationNeed(e.target.value)}
                placeholder="motivation"
                className="inline-block border-b-2 border-gray-400 bg-transparent px-2 py-1 min-w-[200px] focus:outline-none focus:border-gray-700"
              />.
            </p>
            <p>
              What I like about it is{" "}
              <input
                type="text"
                value={positiveAspects}
                onChange={(e) => setPositiveAspects(e.target.value)}
                placeholder="benefits"
                className="inline-block border-b-2 border-gray-400 bg-transparent px-2 py-1 min-w-[200px] focus:outline-none focus:border-gray-700"
              />, but what's frustrating or takes effort is{" "}
              <textarea
                value={frictionPoints}
                onChange={(e) => setFrictionPoints(e.target.value)}
                placeholder="friction points"
                rows={2}
                className="block border-b-2 border-gray-400 bg-transparent px-2 py-1 w-full mt-2 focus:outline-none focus:border-gray-700 resize-none"
              />
            </p>
            <p>
              The whole thing makes me feel{" "}
              <input
                type="text"
                value={emotionalOutcome}
                onChange={(e) => setEmotionalOutcome(e.target.value)}
                placeholder="awesome man"
                className="inline-block border-b-2 border-gray-400 bg-transparent px-2 py-1 min-w-[200px] focus:outline-none focus:border-gray-700"
              />.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !appMethodApproach.trim() || !primaryActivityGoal.trim()}
            className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Generating..." : "Envision 2030"}
          </button>
        </div>

        <AnimatePresence>
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-12 p-8 bg-gray-50 rounded-lg"
            >
              <h2 className="text-3xl font-medium mb-6">Your 2030 Vision</h2>
              <div className="text-lg leading-relaxed whitespace-pre-wrap text-center">
                {output}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
