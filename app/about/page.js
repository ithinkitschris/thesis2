"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getAllArticles } from '../data/articles';
import RiskTrustMatrix from '../../components/RiskTrustMatrix';

export default function Research() {
  const articles = getAllArticles().slice(0, 3);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          <p className="text-[26pt] mx-auto font-semibold tracking-[-0.0em] leading-tight bg-gradient-to-t from-black/75 to-black/55 bg-clip-text text-transparent">
            Bargaining with the Future is a Master's thesis by <a href="https://www.ithinkitschris.com" target="_blank" rel="noopener noreferrer" className="inline-block underline text-black/10 transition-all duration-100 hover:scale-[0.97] hover:text-white/50">Chris Leow</a>, a Graduate Student in Interaction Design in New York City.
          </p>
          <p className="text-2xl font-medium tracking-[-0.01em] mx-auto mt-5 text-black/60 max-w-[90%]">
            It is a speculative design exercise that seeks to investigate how visual and motion design may be used to cultivate trust with users in AI-native operating systems.
          </p>
          <p className="text-lg font-medium tracking-[-0.01em] mx-auto leading-normal mt-8 text-black/50 max-w-[70%]">
            If the current incarnation of LifeOS on this site terrifies you, fret not; that's the point. I am not insane <span className="italic">(to a certain degree)</span>. It is currently a research artifact for understanding current day comfort levels towards an AI-native Operating System that has been designed with no consideration for agency nor control.
          </p>
          {/* <ul className="list-decimal list-inside text-lg mt-4" >
            <li>To investigate the role of agency in a fully agentic future</li>
            <li>To explore the relationship between user and technology</li>
            <li>To understand the impact of technology on user behavior</li>
          </ul> */}
        </div>

        {/* Images */}
        {/* <div className="max-w-2xl mx-auto mt-20 mb-12">
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
        </div> */}

        {/* <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg mx-auto">
            Find me at <a href="https:ithinkitschris.com" className="text-[#007AFF]">ithinkitschris.com</a>.
          </p>
        </div> */}

        {/* View Progress Link */}
        <div className="flex justify-center items-center mb-4 mt-18">
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

        {/* Contribute Section */}
        <div id="contribute" className="max-w-4xl mx-auto mt-52 mb-12">
          <h2 className="text-5xl font-semibold tracking-tight text-center bg-gradient-to-t from-black/75 to-black/55 bg-clip-text text-transparent mb-14">
            Contribute
          </h2>
          <p className="text-3xl font-semibold tracking-[-0.01em] mx-auto text-center text-black/70 max-w-[90%] mb-1">
            <span className="text-lg">01.</span><br/>Low/high risk/trust
          </p>
          <p className="text-lg font-medium tracking-[-0.01em] text-center text-black/60">
            If you had to automate tasks in your life, where would you chart them here?
          </p>
          <RiskTrustMatrix />
        </div>

        {/* Notes & Reflections Section */}
        <div id="notes-reflections" className="max-w-2xl mx-auto mt-52 mb-12">
          <h2 className="text-5xl font-semibold tracking-tight text-center bg-gradient-to-t from-black/75 to-black/55 bg-clip-text text-transparent mb-10">
            Notes & Reflections
          </h2>

          <div className="space-y-4">
            {articles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`}>
                <motion.div
                  className="group bg-white hover:bg-black/70 rounded-4xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.08)] hover:shadow-none px-6 py-4 cursor-pointer transition-colors duration-200"
                  whileHover={{ scale: 0.99 }}
                  transition={{
                    type: "spring",
                    stiffness: 600,
                    damping: 22
                  }}
                >
                  <h3 className="text-lg font-semibold text-black/70 group-hover:text-white/90 transition-colors duration-200">
                    {article.title}
                  </h3>
                  <p className="text-black/50 group-hover:text-white/70 mt-1 text-sm transition-colors duration-200">
                    {article.excerpt}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-black/40 group-hover:text-white/50 transition-colors duration-200">
                    <span>{formatDate(article.date)}</span>
                    <span>{article.readingTime} min read</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Memoji Wave - Bottom of Content */}
        <div className="flex justify-center items-center ml-24 mt-36 drop-shadow-2xl overflow-hidden" style={{ height: '310px' }}>
          <Image 
            src="/memojiwave.svg" 
            alt="Memoji Wave" 
            width={300} 
            height={300}
            className="h-auto"
          />
        </div>

      </main>
    </div>
  );
}



