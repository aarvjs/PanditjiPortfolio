"use client";

import React, { useState, useEffect } from "react";

export default function ImageWithFallback({ src, fallbackSrc, alt, className, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);

  // Sync state if src changes
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc || fallbackSrc}
      alt={alt || ""}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}
