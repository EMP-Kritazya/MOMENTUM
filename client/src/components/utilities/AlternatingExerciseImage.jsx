import { useEffect, useState } from "react";

const SWAP_INTERVAL_MS = 1500;

// Crossfades between an exercise's start/end-pose images to give a cheap
// sense of motion from two static photos.
export function AlternatingExerciseImage({ imageUrls, alt, className = "" }) {
  const images = imageUrls?.filter(Boolean) ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, SWAP_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className={`relative aspect-[3/2] overflow-hidden ${className}`}>
      {images.map((url, index) => (
        <img
          key={url}
          src={url}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
