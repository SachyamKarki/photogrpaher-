"use client";

import { useState } from "react";

type ServiceAccordionItem = {
  title: string;
  description: string;
  details: string[];
};

type ServicesAccordionProps = {
  items: ServiceAccordionItem[];
};

export function ServicesAccordion({ items }: ServicesAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 divide-y divide-zinc-200/80">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={`${item.title}:${index}`} className="py-5 sm:py-6">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="group grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-start sm:gap-6"
              aria-expanded={isOpen}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div>
                <div className="font-semibold tracking-tight text-zinc-900">
                  {item.title}
                </div>
                <p className="mt-2 max-w-xl text-sm leading-7 text-zinc-600">
                  {item.description}
                </p>
              </div>

              <span className="flex justify-start sm:justify-end">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-900 transition duration-300 group-hover:border-zinc-900">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 transition duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                    fill="none"
                  >
                    <path
                      d="M5 7.5 10 12.5 15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </button>

            <div
              className={`grid transition-all duration-500 ease-out ${isOpen ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div className="sm:ml-[calc(88px+1.5rem)] sm:max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                    Learn more
                  </p>
                  <div className="mt-4 grid gap-3">
                    {item.details.map((detail) => (
                      <div
                        key={detail}
                        className="flex items-start gap-3 text-sm leading-7 text-zinc-600"
                      >
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-900" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
