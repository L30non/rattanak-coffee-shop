"use client";

import React, { useState } from "react";
import Image from "next/image";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

interface ImageWithFallbackProps {
  src?: string | null;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export function ImageWithFallback({
  src,
  alt = "",
  className,
  style,
  fill = true,
  width,
  height,
  sizes = "100vw",
  priority = false,
  placeholder = "empty",
  blurDataURL,
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  // If src is empty or null, show fallback immediately
  const srcString = typeof src === "string" ? src.trim() : "";

  if (!srcString || didError) {
    return (
      <div
        className={`relative bg-gray-100 flex items-center justify-center ${className ?? ""}`}
        style={style}
      >
        <Image
          src={ERROR_IMG_SRC}
          alt={alt || "No image available"}
          width={88}
          height={88}
          className="opacity-30"
          unoptimized
        />
      </div>
    );
  }

  // Use fill mode by default for responsive images
  if (fill) {
    return (
      <Image
        src={srcString}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        style={{ objectFit: "cover", ...style }}
        onError={handleError}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
      />
    );
  }

  // Use explicit width/height when provided
  return (
    <Image
      src={srcString}
      alt={alt}
      width={width || 300}
      height={height || 300}
      className={className}
      style={style}
      onError={handleError}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
    />
  );
}
