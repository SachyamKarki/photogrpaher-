"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ProgressiveImage } from "@/components/gallery/ProgressiveImage";

type ZoomableImageProps = {
  src: string;
  alt: string;
};

export function ZoomableImage({ src, alt }: ZoomableImageProps) {
  return (
    <TransformWrapper
      initialScale={0.85}
      minScale={0.85}
      maxScale={4}
      centerOnInit={true}
      wheel={{ smoothStep: 0.005 }}
      doubleClick={{ mode: "toggle" }}
      panning={{ velocityDisabled: false }}
    >
      <TransformComponent
        wrapperStyle={{ width: "100%", height: "100%" }}
        contentStyle={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
      >
            <div className="relative w-full h-full cursor-zoom-in">
              <ProgressiveImage
                src={src}
                alt={alt}
                priority
                fetchPriority="high"
                className="object-contain pointer-events-none select-none"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 85vw"
                draggable={false}
              />
            </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
