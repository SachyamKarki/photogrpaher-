"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type Review = {
  _id: string;
  author: string;
  role?: string;
  quote: string;
  featured?: boolean;
};

type ReviewsSectionProps = {
  reviews: Review[];
};

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!reviews || reviews.length === 0) return null;

  const INITIAL_COUNT = 6;
  const displayedReviews = isExpanded ? reviews : reviews.slice(0, INITIAL_COUNT);
  const hasMore = reviews.length > INITIAL_COUNT;

  return (
    <section id="reviews" className="scroll-mt-24 py-16 sm:py-24 lg:py-32 bg-white">
      <Reveal>
        <SectionHeading
          title="Testimonials"
          subtitle="Experiences and thoughts from people we've had the pleasure of working with."
        />
      </Reveal>

      <div className="mx-auto mt-16 max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {displayedReviews.map((review, idx) => (
              <motion.div
                key={review._id}
                initial={idx >= INITIAL_COUNT ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.5, 
                  delay: idx >= INITIAL_COUNT ? (idx - INITIAL_COUNT) * 0.1 : 0,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
              >
                <div className="group/card flex flex-col justify-between h-full p-8 rounded-[2rem] bg-white border border-zinc-100 transition-all duration-500 hover:border-zinc-200 hover:-translate-y-1">
                  <blockquote>
                    <span className="font-heading absolute -mt-4 -ml-2 text-4xl leading-none text-zinc-300">
                      &quot;
                    </span>
                    <p className="relative z-10 font-heading text-[15px] leading-relaxed italic text-zinc-700 md:text-[17px]">
                      {review.quote}
                    </p>
                  </blockquote>
                  
                  <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col">
                    <span className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
                      {review.author}
                    </span>
                    {review.role && (
                    <span className="text-xs text-zinc-500 mt-1 uppercase tracking-[0.05em] font-medium">
                      {review.role}
                    </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {hasMore && !isExpanded && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-900 px-8 text-sm font-medium tracking-[0.02em] text-zinc-900 transition hover:bg-zinc-900 hover:text-white group"
            >
              <span>View more testimonials</span>
              <svg 
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
