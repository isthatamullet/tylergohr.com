// Blog System - Core Utilities

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { format, parseISO } from 'date-fns';
import type { 
  BlogPost, 
  BlogPostMetadata, 
  BlogPostFrontmatter,
  BlogTagInfo
} from './blog-types';

// Configure marked for syntax highlighting and security
marked.setOptions({
  gfm: true,
  breaks: false,
});

const CONTENT_PATH = path.join(process.cwd(), 'content', 'blog');

/**
 * Get all blog post files from the content directory
 */
function getBlogPostFiles(): string[] {
  if (!fs.existsSync(CONTENT_PATH)) {
    return [];
  }
  
  const years = fs.readdirSync(CONTENT_PATH)
    .filter(item => fs.statSync(path.join(CONTENT_PATH, item)).isDirectory())
    .filter(item => !item.startsWith('.') && item !== 'assets');
  
  const files: string[] = [];
  
  for (const year of years) {
    const yearPath = path.join(CONTENT_PATH, year);
    const yearFiles = fs.readdirSync(yearPath)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(year, file));
    
    files.push(...yearFiles);
  }
  
  return files;
}

/**
 * Parse a markdown file and extract frontmatter
 */
async function parseMarkdownFile(filePath: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(CONTENT_PATH, filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Validate required frontmatter fields
    const requiredFields = ['title', 'slug', 'date', 'excerpt', 'author'];
    for (const field of requiredFields) {
      if (!data[field]) {
        console.warn(`Missing required field "${field}" in ${filePath}`);
        return null;
      }
    }
    
    // Ensure tags is an array
    if (!Array.isArray(data.tags)) {
      data.tags = data.tags ? [data.tags] : [];
    }
    
    // Process content through marked (handle Promise in newer versions)
    const processedContent = typeof marked(content) === 'string' 
      ? marked(content) as string
      : await marked(content);
    
    return {
      frontmatter: {
        title: data.title,
        slug: data.slug,
        date: data.date,
        excerpt: data.excerpt,
        tags: data.tags,
        featured: Boolean(data.featured),
        author: data.author,
        readTime: data.readTime || '5 min read',
      } as BlogPostFrontmatter,
      content: processedContent,
      filePath,
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export async function getAllPosts(): Promise<BlogPostMetadata[]> {
  const files = getBlogPostFiles();
  const posts: BlogPostMetadata[] = [];
  
  for (const file of files) {
    const post = await parseMarkdownFile(file);
    if (post) {
      posts.push({
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
    }
  }
  
  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Get a specific blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const files = getBlogPostFiles();
  
  for (const file of files) {
    const post = await parseMarkdownFile(file);
    if (post && post.frontmatter.slug === slug) {
      return post;
    }
  }
  
  return null;
}

/**
 * Get blog posts filtered by tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPostMetadata[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => 
    post.tags.some(postTag => 
      postTag.toLowerCase() === tag.toLowerCase()
    )
  );
}

/**
 * Get featured blog posts
 */
export async function getFeaturedPosts(): Promise<BlogPostMetadata[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.featured);
}

/**
 * Get all unique tags with post counts
 */
export async function getAllTags(): Promise<BlogTagInfo[]> {
  const allPosts = await getAllPosts();
  const tagMap = new Map<string, BlogPostMetadata[]>();
  
  for (const post of allPosts) {
    for (const tag of post.tags) {
      const normalizedTag = tag.toLowerCase();
      if (!tagMap.has(normalizedTag)) {
        tagMap.set(normalizedTag, []);
      }
      tagMap.get(normalizedTag)!.push(post);
    }
  }
  
  return Array.from(tagMap.entries())
    .map(([tag, posts]) => ({
      tag: tag,
      count: posts.length,
      posts: posts,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get related posts based on shared tags
 */
export async function getRelatedPosts(currentPost: BlogPostMetadata, limit: number = 3): Promise<BlogPostMetadata[]> {
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => {
      const sharedTags = post.tags.filter(tag => 
        currentPost.tags.some(currentTag => 
          currentTag.toLowerCase() === tag.toLowerCase()
        )
      );
      return {
        post,
        relevanceScore: sharedTags.length,
      };
    })
    .filter(item => item.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit)
    .map(item => item.post);
  
  return relatedPosts;
}

/**
 * Format date for display
 */
export function formatPostDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Generate reading time estimate from content
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}