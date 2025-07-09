"use client";

import { useState } from "react";
import Image from "next/image";
import { PhotoAsset } from "@/lib/types";
import styles from "./PhotoCard.module.css";

interface PhotoCardProps {
  photo: PhotoAsset;
  onViewDetails?: (photo: PhotoAsset) => void;
  showMetadata?: boolean;
  priority?: boolean;
  className?: string;
}

export default function PhotoCard({
  photo,
  onViewDetails,
  showMetadata = false,
  priority = false,
  className = "",
}: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imagePath = `/images/photography/${photo.category}/${photo.filename}`;

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(photo);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      className={`${styles.photoCard} ${className} ${
        isLoaded ? styles.loaded : ""
      } fade-in-on-scroll`}
      onClick={onViewDetails ? handleClick : undefined}
      onKeyDown={onViewDetails ? handleKeyDown : undefined}
      tabIndex={onViewDetails ? 0 : -1}
      role={onViewDetails ? "button" : undefined}
      aria-label={
        onViewDetails
          ? `View details for ${photo.title}`
          : `Photo: ${photo.title}`
      }
    >
      {/* Image Container */}
      <div className={styles.imageContainer}>
        {!hasError ? (
          <Image
            src={imagePath}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            priority={priority}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        ) : (
          <div className={styles.errorState}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" />
            </svg>
            <span>Image unavailable</span>
          </div>
        )}

        {/* Category Badge */}
        <div className={styles.categoryBadge}>
          {photo.category.replace("-", " ")}
        </div>

        {/* Featured Badge */}
        {photo.featured && (
          <div className={styles.featuredBadge} aria-label="Featured photo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        )}

        {/* Loading State */}
        {!isLoaded && !hasError && (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}
      </div>

      {/* Photo Info */}
      <div className={styles.photoInfo}>
        <h3 className={styles.photoTitle}>{photo.title}</h3>
        {photo.description && (
          <p className={styles.photoDescription}>{photo.description}</p>
        )}

        {/* Tags */}
        {photo.tags && photo.tags.length > 0 && (
          <div className={styles.tags} aria-label="Photo tags">
            {photo.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
            {photo.tags.length > 3 && (
              <span className={styles.tagCount}>
                +{photo.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        {showMetadata && (
          <div className={styles.metadata}>
            {photo.dateTaken && (
              <div className={styles.metadataItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" />
                </svg>
                <span>{new Date(photo.dateTaken).toLocaleDateString()}</span>
              </div>
            )}
            
            {photo.location && (
              <div className={styles.metadataItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z" />
                </svg>
                <span>{photo.location}</span>
              </div>
            )}

            {photo.settings && (
              <div className={styles.cameraSettings}>
                {photo.settings.aperture && (
                  <span className={styles.setting}>f/{photo.settings.aperture}</span>
                )}
                {photo.settings.shutterSpeed && (
                  <span className={styles.setting}>{photo.settings.shutterSpeed}</span>
                )}
                {photo.settings.iso && (
                  <span className={styles.setting}>ISO {photo.settings.iso}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* View Details Indicator */}
      {onViewDetails && (
        <div className={styles.viewIndicator} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5S21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12S9.24 7 12 7 17 9.24 17 12 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12S10.34 15 12 15 15 13.66 15 12 13.66 9 12 9Z" />
          </svg>
        </div>
      )}
    </article>
  );
}