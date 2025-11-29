"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [userFlow, setUserFlow] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!userFlow.trim()) {
      return;
    }

    setIsLoading(true);
    setOutput("");

    const filledPrompt = `I want to envision how the following user flow will work in 2030:

Current user flow: ${userFlow}
${context ? `Additional context: ${context}` : ""}

Please describe in detail how this user flow might be transformed in the year 2030, considering emerging technologies, AI advancements, and new interaction paradigms.`;

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
        <h1 className="text-7xl tracking-[-0.02em] font-medium mb-12">
          Bargaining with the Future.
        </h1>

        <div className="space-y-6 mb-8">
          <div className="text-xl leading-relaxed">
            <p className="mb-4">
              In 2024, when I want to{" "}
              <input
                type="text"
                value={userFlow}
                onChange={(e) => setUserFlow(e.target.value)}
                placeholder="listen to music"
                className="inline-block border-b-2 border-gray-400 bg-transparent px-2 py-1 min-w-[300px] focus:outline-none focus:border-gray-700 text-center"
              />
              , I follow this process:
            </p>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe the current user flow in detail..."
              rows={6}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-700 resize-none text-center"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !userFlow.trim()}
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
