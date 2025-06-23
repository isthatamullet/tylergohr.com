// Blog Listing Page - Next.js App Router

import { getAllPosts, getAllTags, formatPostDate } from '@/lib/blog';
import styles from './page.module.css';
import Link from 'next/link';

export const metadata = {
  title: 'Technical Blog | Tyler Gohr',
  description: 'In-depth technical articles about full-stack development, architecture decisions, and engineering insights.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  return (
    <div className={styles.container}>
      {/* Blog Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Technical Blog</h1>
          <p className={styles.subtitle}>
            In-depth articles about full-stack development, architecture decisions, and engineering insights
          </p>
          
          {/* Navigation breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink}>
              Portfolio
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>Blog</span>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        {/* Tag Cloud */}
        {tags.length > 0 && (
          <section className={styles.tagsSection} aria-labelledby="tags-heading">
            <h2 id="tags-heading" className={styles.tagsHeading}>Topics</h2>
            <div className={styles.tagCloud}>
              {tags.map((tagInfo) => (
                <Link
                  key={tagInfo.tag}
                  href={`/blog?tag=${encodeURIComponent(tagInfo.tag)}`}
                  className={styles.tag}
                  aria-label={`View ${tagInfo.count} posts tagged with ${tagInfo.tag}`}
                >
                  {tagInfo.tag}
                  <span className={styles.tagCount}>{tagInfo.count}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Blog Posts */}
        <section className={styles.postsSection} aria-labelledby="posts-heading">
          <h2 id="posts-heading" className={styles.visuallyHidden}>Blog Posts</h2>
          
          {posts.length === 0 ? (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>No posts yet</h3>
              <p className={styles.emptyMessage}>
                Technical articles and insights are coming soon. 
                Check back for in-depth content about development practices and architecture decisions.
              </p>
            </div>
          ) : (
            <div className={styles.postsGrid}>
              {posts.map((post) => (
                <article key={post.slug} className={styles.postCard}>
                  <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                    <div className={styles.postContent}>
                      {/* Post metadata */}
                      <div className={styles.postMeta}>
                        <time dateTime={post.date} className={styles.postDate}>
                          {formatPostDate(post.date)}
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
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}