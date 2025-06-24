"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPostMetadata } from '@/lib/blog-types';
import styles from '../app/blog/page.module.css';

interface BlogCardProps {
  post: BlogPostMetadata;
  formattedDate: string;
}

export default function BlogCard({ post, formattedDate }: BlogCardProps) {
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

  return (
    <article className={styles.postCard}>
      <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
        <div className={styles.postContent}>
          {/* Thumbnail image */}
          {post.image && !imageError && (
            <div className={styles.thumbnailContainer}>
              <Image
                src={post.image}
                alt={post.imageAlt || `${post.title} featured image`}
                fill
                className={styles.thumbnail}
                style={{
                  objectPosition: getObjectPosition(post.thumbnailFocalPoint),
                }}
                sizes="120px"
                loading="lazy"
                onError={() => {
                  console.warn(`Failed to load image for blog post: ${post.slug}`);
                  setImageError(true);
                }}
                onLoad={() => setImageLoading(false)}
              />
              {imageLoading && (
                <div className={styles.thumbnailPlaceholder} aria-hidden="true">
                  <div className={styles.loadingSpinner}></div>
                </div>
              )}
            </div>
          )}

          {/* Content area - shifted right when image present */}
          <div className={styles.contentArea}>
            {/* Post metadata */}
            <div className={styles.postMeta}>
              <time dateTime={post.date} className={styles.postDate}>
                {formattedDate}
              </time>
              <span className={styles.readTime}>{post.readTime}</span>
              {post.featured && (
                <span className={styles.featuredBadge} aria-label="Featured post">
                  Featured
                </span>
              )}
            </div>

            {/* Post title and excerpt */}
            <h3 className={styles.postTitle}>
              {post.title}
            </h3>
            
            <p className={styles.postExcerpt}>{post.excerpt}</p>
          </div>

          {/* Post tags - full width */}
          {post.tags.length > 0 && (
            <div className={styles.postTags}>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className={styles.postTag}
                  onClick={(e) => e.stopPropagation()}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Read more indicator - full width */}
          <div className={styles.readMore}>
            Read Article
            <span className={styles.readMoreArrow}>→</span>
          </div>
        </div>
      </Link>
    </article>
  );
}