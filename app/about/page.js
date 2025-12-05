"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Research() {
  return (
    <div className="flex min-h-screen items-center justify-center relative">
      <main className="px-8 text-left">

        {/* Header */}
        <div className="w-[70%] mx-auto mb-12 mt-32 text-center">
          <Image 
            src="/flower.svg" 
            alt="Flower" 
            width={200} 
            height={200}
            className="w-full h-auto"
          />
        </div>

        {/* Body */}
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-4xl mx-auto font-semibold tracking-[-0.0em] leading-tight bg-gradient-to-t from-black/75 to-black/55 bg-clip-text text-transparent">
            Bargaining with the Future is a Master's thesis by <a href="https://www.ithinkitschris.com" target="_blank" rel="noopener noreferrer" className="inline-block underline text-black/10 transition-all duration-100 hover:scale-[0.97] hover:text-white/50">Chris Leow</a>, a Graduate Student at the School of Visual Arts in New York City. It is a speculative design exercise that seeks to investigate user agency in a fully agentic future; with three main goals:  
          </p>
          {/* <ul className="list-decimal list-inside text-lg mt-4" >
            <li>To investigate the role of agency in a fully agentic future</li>
            <li>To explore the relationship between user and technology</li>
            <li>To understand the impact of technology on user behavior</li>
          </ul> */}
        </div>

        {/* Images */}
        <div className="max-w-2xl mx-auto mt-20 mb-12">
          <Image 
            src="/thesisobjective1.svg" 
            alt="Thesis Objective 1" 
            width={800} 
            height={600}
            className="w-full h-auto rounded-4xl drop-shadow-xl"
          />
          <Image 
            src="/thesisobjective2.svg" 
            alt="Thesis Objective 2" 
            width={800} 
            height={600}
            className="w-full h-auto rounded-4xl drop-shadow-xl mt-8"
          />
          <Image 
            src="/thesisobjective3.svg" 
            alt="Thesis Objective 3" 
            width={800} 
            height={600}
            className="w-full h-auto rounded-4xl drop-shadow-xl mt-8"
          />
        </div>

        {/* <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg mx-auto">
            Find me at <a href="https:ithinkitschris.com" className="text-[#007AFF]">ithinkitschris.com</a>.
          </p>
        </div> */}

        {/* View Progress Link */}
        <div className="flex justify-center items-center mt-4 mb-4">
          <motion.div 
            className="group bg-white hover:bg-black/70 rounded-4xl drop-shadow-xl hover:shadow-none px-6 py-2.5 inline-block cursor-pointer transition-colors duration-200"
            whileHover={{ 
              scale: 0.95
            }}
            transition={{
              type: "spring",
              stiffness: 600,
              damping: 22
            }}
          >
            <a 
              href="https://www.figma.com/deck/lDuqBcyzUYp4EIbKA8Busy/Thesis-Presentation--Dec-9-?node-id=1-42&t=pkUKckgAZfTuFGhJ-1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg tracking-tight text-black/60 group-hover:text-white/90 font-semibold transition-colors duration-200 block"
            >
              View the latest deck here
            </a>
          </motion.div>
        </div>

        {/* Memoji Wave - Bottom of Content */}
        <div className="flex justify-center items-center ml-24 drop-shadow-2xl mt-48 overflow-hidden" style={{ height: '340px' }}>
          <Image 
            src="/memojiwave.svg" 
            alt="Memoji Wave" 
            width={350} 
            height={350}
            className="h-auto"
          />
        </div>

      </main>
    </div>
  );
}


