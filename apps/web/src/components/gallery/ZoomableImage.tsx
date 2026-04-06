"use client";

import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
              <Image
                src={src}
                alt={alt}
                fill
                priority
                className="object-contain pointer-events-none select-none"
                sizes="(max-width: 1024px) 100vw, 85vw"
                draggable={false}
              />
            </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
