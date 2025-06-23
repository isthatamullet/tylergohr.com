// Individual Blog Post Page - Next.js App Router

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts, getRelatedPosts, formatPostDate } from '@/lib/blog';
import styles from './page.module.css';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Tyler Gohr',
    };
  }

  return {
    title: `${post.frontmatter.title} | Tyler Gohr`,
    description: post.frontmatter.excerpt,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      type: 'article',
      publishedTime: post.frontmatter.date,
      authors: [post.frontmatter.author],
      tags: post.frontmatter.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts({
    title: post.frontmatter.title,
    slug: post.frontmatter.slug,
    date: post.frontmatter.date,
    excerpt: post.frontmatter.excerpt,
    tags: post.frontmatter.tags,
    featured: post.frontmatter.featured,
    author: post.frontmatter.author,
    readTime: post.frontmatter.readTime,
    filePath: post.filePath,
  });

  return (
    <div className={styles.container}>
      {/* Blog Post Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* Navigation breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink}>
              Portfolio
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link href="/blog" className={styles.breadcrumbLink}>
              Blog
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{post.frontmatter.title}</span>
          </nav>

          {/* Post metadata */}
          <div className={styles.postMeta}>
            <time dateTime={post.frontmatter.date} className={styles.postDate}>
              {formatPostDate(post.frontmatter.date)}
            </time>
            <span className={styles.readTime}>{post.frontmatter.readTime}</span>
            <span className={styles.author}>by {post.frontmatter.author}</span>
            {post.frontmatter.featured && (
              <span className={styles.featuredBadge} aria-label="Featured post">
                Featured
              </span>
            )}
          </div>

          {/* Post title */}
          <h1 className={styles.title}>{post.frontmatter.title}</h1>
          
          {/* Post excerpt */}
          <p className={styles.excerpt}>{post.frontmatter.excerpt}</p>

          {/* Post tags */}
          {post.frontmatter.tags.length > 0 && (
            <div className={styles.tags}>
              {post.frontmatter.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className={styles.tag}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Blog Post Content */}
      <main className={styles.main}>
        <article className={styles.article}>
          <div 
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <aside className={styles.relatedSection} aria-labelledby="related-heading">
            <h2 id="related-heading" className={styles.relatedHeading}>
              Related Articles
            </h2>
            <div className={styles.relatedPosts}>
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.slug} className={styles.relatedCard}>
                  <div className={styles.relatedMeta}>
                    <time dateTime={relatedPost.date} className={styles.relatedDate}>
                      {formatPostDate(relatedPost.date)}
                    </time>
                    <span className={styles.relatedReadTime}>{relatedPost.readTime}</span>
                  </div>
                  
                  <h3 className={styles.relatedTitle}>
                    <Link href={`/blog/${relatedPost.slug}`} className={styles.relatedLink}>
                      {relatedPost.title}
                    </Link>
                  </h3>
                  
                  <p className={styles.relatedExcerpt}>{relatedPost.excerpt}</p>
                  
                  {relatedPost.tags.length > 0 && (
                    <div className={styles.relatedTags}>
                      {relatedPost.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className={styles.relatedTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </aside>
        )}

        {/* Back to Blog */}
        <div className={styles.navigation}>
          <Link href="/blog" className={styles.backLink}>
            ← Back to Blog
          </Link>
        </div>
      </main>
    </div>
  );
}