import Image from 'next/image';
import { ComponentProps } from 'react';

interface OptimizedImageProps extends Omit<ComponentProps<typeof Image>, 'src'> {
  src: string;
  alt: string;
  priority?: boolean;
  quality?: number;
}

/**
 * Optimized image component for landing page
 * Uses Next.js Image with automatic format optimization (AVIF/WebP)
 * and responsive srcset generation
 */
export function OptimizedImage({
  src,
  alt,
  priority = false,
  quality = 85,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      quality={quality}
      className={className}
      loading={priority ? undefined : 'lazy'}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
      {...props}
    />
  );
}
