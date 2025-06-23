"use client";

import Link from 'next/link';
import { BlogPostMetadata } from '@/lib/blog-types';
import styles from '../app/blog/page.module.css';

interface BlogCardProps {
  post: BlogPostMetadata;
  formattedDate: string;
}

export default function BlogCard({ post, formattedDate }: BlogCardProps) {
  return (
    <article className={styles.postCard}>
      <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
        <div className={styles.postContent}>
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

          {/* Post tags */}
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

          {/* Read more indicator */}
          <div className={styles.readMore}>
            Read Article
            <span className={styles.readMoreArrow}>→</span>
          </div>
        </div>
      </Link>
    </article>
  );
}