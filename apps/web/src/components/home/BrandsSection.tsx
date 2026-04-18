"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { urlFor } from "@/lib/sanity/image";

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
  const activePartners = sanityPartners;
  const duplicatedBrands = [...activePartners, ...activePartners];

  // Scale animation speed based on number of partners for consistent feel
  const scrollDuration = Math.max(20, activePartners.length * 4);

  return (
    <section className="relative w-full py-16 sm:py-24 lg:py-32 overflow-hidden bg-white">


      <div className="mx-auto max-w-7xl px-6 sm:px-6 md:px-8 mb-10 md:mb-14">
        <SectionHeading
          title="Industry Partners"
          align="center"
        />
      </div>

      <div className="relative flex overflow-hidden py-4">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center w-max"
          animate={{ x: [0, "-50%"] }}
          transition={{
            duration: scrollDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {duplicatedBrands.map((brand, i) => (
            <div
              key={i}
              className="group flex flex-col items-center justify-center shrink-0 pr-6 sm:pr-12 md:pr-16"
            >
              {brand.logo ? (
                <div className="relative h-10 sm:h-14 md:h-16 w-[80px] sm:w-[130px] md:w-[160px]">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    draggable={false}
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 130px, 160px"
                    className="object-contain opacity-50 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 pointer-events-none select-none"
                    unoptimized={!brand.logo.startsWith("http")}
                  />
                </div>
              ) : (
                <span className="font-heading text-sm sm:text-base md:text-lg font-semibold uppercase tracking-[0.08em] text-zinc-300 transition-colors duration-300 group-hover:text-zinc-800">
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
