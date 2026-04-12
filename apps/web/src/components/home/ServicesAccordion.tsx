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
          <div key={`${item.title}:${index}`} className="py-6 sm:py-8">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="group flex w-full items-baseline justify-between text-left"
              aria-expanded={isOpen}
            >
              <div className="flex items-baseline gap-2 sm:gap-4">
                <span className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl w-6 sm:w-8 shrink-0">
                  {index + 1}.
                </span>
                <h3 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
                  {item.title}
                </h3>
              </div>

              <span className="flex items-center h-full self-center">
                <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-zinc-900 shadow-sm shadow-black/5 transition duration-300 group-hover:bg-zinc-50">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className={`h-5 w-5 transition duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}
                    fill="none"
                  >
                    <path
                      d="M10 4.5v11"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.5 10h11"
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
              className={`grid transition-all duration-500 ease-out ${isOpen ? "mt-8 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <div className="pl-8 sm:pl-12">
                  {/* Service Description in Expanded View */}
                  <p className="text-sm leading-7 text-zinc-600 mb-8">
                    {item.description}
                  </p>

                  <ul className="space-y-4">
                    {item.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-4 text-sm leading-7 text-zinc-600"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mt-[6px] h-3.5 w-3.5 shrink-0 text-zinc-900"
                        >
                          <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
