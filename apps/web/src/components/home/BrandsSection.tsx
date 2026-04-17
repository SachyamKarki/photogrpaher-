"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { urlFor } from "@/lib/sanity/image";
import { brandPartners } from "@/lib/portfolio/data";

interface Partner {
  _id: string;
  name: string;
  logo?: {
    asset?: {
      _id: string;
      url: string;
    };
  } | null;
}

export function BrandsSection({ partners }: { partners?: Partner[] | null }) {
  // Map Sanity partners for easy access and normalization
  const sanityPartners = (partners && partners.length > 0)
    ? partners.map(p => {
        let logoUrl = "";
        const logo = p.logo;
        if (logo?.asset?._id) {
          const builder = urlFor(logo);
          logoUrl = builder ? builder.url() : (logo.asset.url || "");
        } else {
          logoUrl = logo?.asset?.url || "";
        }
        return { name: p.name, logo: logoUrl };
      })
    : [];

  // Merge Sanity partners with local brandPartners
  // We prioritize Sanity data but ensure every brand from data.ts is represented
  const mergedPartners = [...brandPartners];
  
  sanityPartners.forEach(sp => {
    const localIndex = mergedPartners.findIndex(lp => lp.name.toLowerCase() === sp.name.toLowerCase());
    if (localIndex !== -1) {
      // Update existing local entry with Sanity data if available
      if (sp.logo) mergedPartners[localIndex] = sp;
    } else {
      // Add new partner from Sanity that isn't in local data
      mergedPartners.push(sp);
    }
  });

  const activePartners = mergedPartners;

  const duplicatedBrands = [...activePartners, ...activePartners];

  return (
    <section className="relative w-full py-12 md:py-20 overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-12">
        <SectionHeading
          title="Industry Partners"
          align="center"
        />
      </div>

      <div className="relative flex overflow-hidden">
        {/* Gradients for smooth fade in/out */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-60 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-60 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex whitespace-nowrap gap-6 md:gap-12 items-center"
          animate={{
            x: [0, "-50%"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {duplicatedBrands.map((brand, i) => (
            <div
              key={i}
              className="flex items-center justify-center min-w-[100px] md:min-w-[160px] h-12 md:h-20 px-2"
            >
              {brand.logo ? (
                <div className="relative h-full w-[140px] md:w-[200px]">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 768px) 140px, 200px"
                    className="object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500"
                    unoptimized={!brand.logo.startsWith("http")}
                  />
                </div>
              ) : (
                <span className="font-heading text-lg md:text-2xl font-bold tracking-[0.02em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-300 cursor-default">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
