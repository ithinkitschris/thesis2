"use client";

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticleBySlug } from '../../data/articles';

export default function Article({ params }) {
  const { slug } = use(params);
  const article = getArticleBySlug(slug);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-black/70">Article not found</h1>
          <Link href="/about#notes-reflections" className="text-black/50 hover:text-black/70 mt-4 inline-block">
            Back to all articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center relative">
      <main className="max-w-3xl mx-auto px-8 text-left w-full">

        {/* Back Link */}
        <div className="mt-32 mb-8 -ml-4">
          <Link href="/about#notes-reflections">
            <motion.div
              className="group bg-white hover:bg-black/70 rounded-4xl drop-shadow-md hover:shadow-none px-4 py-2 inline-block cursor-pointer transition-colors duration-200"
              whileHover={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 600,
                damping: 22
              }}
            >
              <span className="text-base text-black/60 group-hover:text-white/90 transition-colors duration-200">
                ← Back
              </span>
            </motion.div>
          </Link>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-t from-black/75 to-black/55 bg-clip-text text-transparent">
            {article.title}
          </h1>
          <p className="text-lg text-black/50 mt-2 w-full leading-tight">
            {article.excerpt}
          </p>
          <div className="flex gap-2 mt-6 text-sm text-black/40">
            <span>{formatDate(article.date)}</span>•
            <span>{article.readingTime} min read</span>
          </div>
        </div>

        {/* Article Content */}
        <div className="mb-32">
          <div className="markdown-content prose prose-lg text-black/70">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </div>

      </main>
    </div>
  );
}
