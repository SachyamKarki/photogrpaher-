"use client";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type Review = {
  _id: string;
  author: string;
  role?: string;
  quote: string;
};

type ReviewsSectionProps = {
  reviews: Review[];
};

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) return null;

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
          {reviews.map((review, idx) => (
            <Reveal key={review._id} delayMs={idx * 100}>
              <div className="group/card flex flex-col justify-between h-full p-8 rounded-[2rem] bg-white border border-zinc-100 transition-all duration-500 hover:border-zinc-200 hover:-translate-y-1">
                <blockquote>
                  <span className="font-heading absolute -mt-4 -ml-2 text-4xl leading-none text-zinc-300">
                    &quot;
                  </span>
                  <p className="relative z-10 text-sm leading-relaxed italic text-zinc-600 md:text-base">
                    {review.quote}
                  </p>
                </blockquote>
                
                <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col">
                  <span className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
                    {review.author}
                  </span>
                  {review.role && (
                    <span className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-medium">
                      {review.role}
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
