"use client";

import { useState } from "react";
import { PhotoAsset, PhotoFilter } from "@/lib/types";
import PhotoCard from "./PhotoCard";
import styles from "./PhotoGallery.module.css";

interface PhotoGalleryProps {
  photos: PhotoAsset[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  layout?: 'grid' | 'masonry' | 'carousel';
  limit?: number;
  showMetadata?: boolean;
  onPhotoSelect?: (photo: PhotoAsset) => void;
}

export default function PhotoGallery({
  photos,
  title = "Professional Photography",
  subtitle = "Capturing technical excellence and professional moments",
  showFilters = false,
  layout = 'grid',
  limit,
  showMetadata = false,
  onPhotoSelect,
}: PhotoGalleryProps) {
  const [filter, setFilter] = useState<PhotoFilter>({});

  // Filter photos based on current filter
  const filteredPhotos = photos.filter((photo) => {
    if (filter.category && photo.category !== filter.category) return false;
    if (filter.featured !== undefined && photo.featured !== filter.featured) return false;
    if (
      filter.tag &&
      (!photo.tags || !photo.tags.some((tag) =>
        tag.toLowerCase().includes(filter.tag!.toLowerCase())
      ))
    )
      return false;
    return true;
  });

  // Apply limit if specified
  const displayPhotos = limit
    ? filteredPhotos.slice(0, limit)
    : filteredPhotos;

  // Get unique categories and tags for filters
  const categories = [...new Set(photos.map((p) => p.category))];
  const allTags = [...new Set(photos.flatMap((p) => p.tags || []))];

  const clearFilters = () => {
    setFilter({});
  };

  const hasActiveFilters = Object.keys(filter).some(
    (key) => filter[key as keyof PhotoFilter] !== undefined,
  );

  return (
    <section
      className={styles.photoGallery}
      aria-labelledby="photos-title"
      role="region"
    >
      {/* Section Header */}
      <header className={styles.galleryHeader}>
        <div className="container">
          <h2
            id="photos-title"
            className={`${styles.galleryTitle} slide-in-left`}
          >
            {title}
          </h2>
          <p
            id="photos-description"
            className={`${styles.gallerySubtitle} slide-in-right`}
          >
            {subtitle}
          </p>
        </div>
      </header>

      {/* Filters */}
      {showFilters && (
        <div className={styles.filtersSection}>
          <div className="container">
            <form
              className={`${styles.filters} fade-in-on-scroll`}
              role="search"
              aria-labelledby="photo-filters-title"
              onSubmit={(e) => e.preventDefault()}
            >
              <h3 id="photo-filters-title" className="sr-only">
                Filter Photos
              </h3>

              <div className={styles.filterGroup}>
                <label htmlFor="category-filter" className={styles.filterLabel}>
                  Category
                </label>
                <select
                  id="category-filter"
                  className={styles.filterSelect}
                  value={filter.category || ""}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      category:
                        (e.target.value as PhotoAsset["category"]) || undefined,
                    }))
                  }
                  aria-describedby="category-help"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
                <div id="category-help" className="sr-only">
                  Filter photos by category type
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="tag-filter" className={styles.filterLabel}>
                  Tag
                </label>
                <select
                  id="tag-filter"
                  className={styles.filterSelect}
                  value={filter.tag || ""}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      tag: e.target.value || undefined,
                    }))
                  }
                  aria-describedby="tag-help"
                >
                  <option value="">All Tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                <div id="tag-help" className="sr-only">
                  Filter photos by tag
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="featured-filter" className={styles.filterLabel}>
                  Featured
                </label>
                <select
                  id="featured-filter"
                  className={styles.filterSelect}
                  value={filter.featured === undefined ? "" : filter.featured.toString()}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      featured: e.target.value === "" ? undefined : e.target.value === "true",
                    }))
                  }
                  aria-describedby="featured-help"
                >
                  <option value="">All Photos</option>
                  <option value="true">Featured Only</option>
                  <option value="false">Non-Featured</option>
                </select>
                <div id="featured-help" className="sr-only">
                  Filter by featured status
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  className={styles.clearFilters}
                  onClick={clearFilters}
                  aria-label="Clear all active filters"
                >
                  Clear Filters
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Photos Grid */}
      <div className={styles.photosSection}>
        <div className="container">
          {displayPhotos.length > 0 ? (
            <div
              className={`${styles.photosGrid} ${styles[`layout-${layout}`]}`}
              role="grid"
              aria-label={`${displayPhotos.length} photo${displayPhotos.length === 1 ? "" : "s"} found`}
            >
              {displayPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  role="gridcell"
                  aria-rowindex={Math.floor(index / 3) + 1}
                  aria-colindex={(index % 3) + 1}
                  aria-label={`Photo ${index + 1} of ${displayPhotos.length}: ${photo.title}`}
                >
                  <PhotoCard
                    photo={photo}
                    onViewDetails={onPhotoSelect}
                    showMetadata={showMetadata}
                    priority={index < 3} // First 3 photos load with priority
                    className={styles.photoCard}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults} role="status" aria-live="polite">
              <h3 className={styles.noResultsTitle}>No photos found</h3>
              <p className={styles.noResultsText}>
                Try adjusting your filters or check back later for new photos.
              </p>
              <button
                type="button"
                className={styles.clearFilters}
                onClick={clearFilters}
                aria-label="Clear all filters to show all photos"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Photo Count */}
      <div className={styles.photoCount}>
        <div className="container">
          <p className={styles.countText}>
            Showing {displayPhotos.length} of {photos.length} photo{photos.length === 1 ? "" : "s"}
            {hasActiveFilters && " (filtered)"}
          </p>
        </div>
      </div>
    </section>
  );
}