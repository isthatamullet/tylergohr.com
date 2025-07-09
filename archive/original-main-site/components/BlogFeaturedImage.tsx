"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from '../app/blog/[slug]/page.module.css';

interface BlogFeaturedImageProps {
  src: string;
  alt: string;
  focalPoint?: string;
  postSlug: string;
}

export default function BlogFeaturedImage({ 
  src, 
  alt, 
  focalPoint, 
  postSlug 
}: BlogFeaturedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Convert focal point to CSS object-position value
  const getObjectPosition = (focalPoint?: string): string => {
    switch (focalPoint) {
      case 'top': return 'center top';
      case 'bottom': return 'center bottom';
      case 'left': return 'left center';
      case 'right': return 'right center';
      case 'top-left': return 'left top';
      case 'top-right': return 'right top';
      case 'bottom-left': return 'left bottom';
      case 'bottom-right': return 'right bottom';
      case 'center':
      default: return 'center center';
    }
  };

  // Don't render anything if image failed to load
  if (imageError) {
    return null;
  }

  return (
    <div className={styles.featuredImageContainer}>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={675} // 16:9 aspect ratio
        className={styles.featuredImage}
        style={{
          objectPosition: getObjectPosition(focalPoint),
        }}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
        onError={() => {
          console.warn(`Failed to load featured image for blog post: ${postSlug}`);
          setImageError(true);
        }}
        onLoad={() => setImageLoading(false)}
      />
      {imageLoading && (
        <div className={styles.featuredImagePlaceholder} aria-hidden="true">
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
    </div>
  );
}