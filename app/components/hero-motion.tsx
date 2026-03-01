"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HeroMotionProps = {
  images: string[];
  intervalMs?: number;
};

export default function HeroMotion({ images, intervalMs = 4500 }: HeroMotionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <div className="absolute inset-0 opacity-25">
      {images.map((src, index) => {
        const isActive = index === activeIndex;

        return (
          <div key={src} className={`hero-image-slide ${isActive ? "is-active" : ""}`}>
            <Image
              src={src}
              alt="LASCOFED hero"
              fill
              priority={index === 0}
              sizes="100vw"
              className={`hero-bg-motion object-cover ${isActive ? "hero-bg-motion-active" : ""}`}
            />
          </div>
        );
      })}
    </div>
  );
}
