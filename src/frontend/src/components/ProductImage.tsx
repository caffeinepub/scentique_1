import { useEffect, useState } from "react";
import { resolveImageUrl } from "../hooks/useStorageClient";

interface ProductImageProps {
  imageId: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export default function ProductImage({
  imageId,
  alt,
  className,
  fallback,
}: ProductImageProps) {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!imageId) {
      setUrl("");
      return;
    }
    resolveImageUrl(imageId).then((resolved) => {
      if (!cancelled) setUrl(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [imageId]);

  if (error || !url) {
    return (
      <div
        className={`${className} bg-secondary flex items-center justify-center`}
      >
        {fallback ? (
          <img
            src={fallback}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-muted-foreground text-sm font-sans">
            No image
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
