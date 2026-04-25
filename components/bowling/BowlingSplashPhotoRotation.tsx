"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { bowlingPhotos } from "@/lib/bowling/photos";

const photos = [
  bowlingPhotos.mission,
  bowlingPhotos.experience,
  bowlingPhotos.support,
];

export function BowlingSplashPhotoRotation() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % photos.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[340px] overflow-hidden rounded-sm border border-white/15 bg-white/10 shadow-soft sm:min-h-[430px]">
      {photos.map((photo, index) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 40vw, 100vw"
          className={`object-cover transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,19,47,0.02),rgba(17,19,47,0.62))]" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="rounded-sm border-l-4 border-bfb-green bg-bfb-cream p-4 font-heading text-lg font-black leading-tight text-bfb-ink shadow-soft">
          Backpacks, supplies, and a stronger start for students.
        </p>
        <div className="mt-3 flex gap-2">
          {photos.map((photo, index) => (
            <span
              key={`${photo.src}-dot`}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex ? "w-8 bg-bfb-green" : "w-3 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
