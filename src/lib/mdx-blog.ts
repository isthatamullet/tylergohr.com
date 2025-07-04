// Enhanced MDX Blog System - Extends existing blog.ts with MDX support

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { compile } from '@mdx-js/mdx';
import type { 
  BlogPost, 
  BlogPostMetadata, 
  BlogPostFrontmatter 
} from './blog-types';

const CONTENT_PATH = path.join(process.cwd(), 'content', 'blog');

/**
 * Enhanced blog post with MDX support
 */
export interface MDXBlogPost extends BlogPost {
  isMDX: boolean;
  mdxSource?: string;
  estimatedReadTime: string;
}

/**
 * Detect if file is MDX or regular markdown
 */
function isMDXFile(filename: string): boolean {
  return filename.endsWith('.mdx');
}

/**
 * Calculate reading time from content
 */
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  // Remove MDX/JSX syntax for word count
  const cleanContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML/JSX tags
    .replace(/\{[^}]*\}/g, '') // Remove JSX expressions
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, ''); // Remove inline code
  
  const words = cleanContent.split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Process MDX content
 */
async function processMDXContent(content: string): Promise<string> {
  try {
    // Compile MDX to JavaScript
    const compiledSource = await compile(content, {
      outputFormat: 'function-body',
      development: process.env.NODE_ENV === 'development',
      providerImportSource: '@mdx-js/react',
    });
    
    return String(compiledSource);
  } catch (error) {
    console.error('Error processing MDX:', error);
    // Fallback to regular markdown processing
    const processedContent = typeof marked(content) === 'string' 
      ? marked(content) as string
      : await marked(content);
    return processedContent;
  }
}

/**
 * Parse enhanced markdown/MDX file with backward compatibility
 */
export async function parseEnhancedMarkdownFile(filePath: string): Promise<MDXBlogPost | null> {
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
    
    const isMDX = isMDXFile(filePath);
    let processedContent: string;
    let mdxSource: string | undefined;
    
    if (isMDX) {
      // Process as MDX
      mdxSource = await processMDXContent(content);
      processedContent = content; // Keep original for fallback
    } else {
      // Process as regular markdown (backward compatibility)
      processedContent = typeof marked(content) === 'string' 
        ? marked(content) as string
        : await marked(content);
    }
    
    // Calculate reading time
    const estimatedReadTime = data.readTime || calculateReadingTime(content);
    
    return {
      frontmatter: {
        title: data.title,
        slug: data.slug,
        date: data.date,
        excerpt: data.excerpt,
        tags: data.tags,
        featured: Boolean(data.featured),
        author: data.author,
        readTime: estimatedReadTime,
        image: data.image,
        imageAlt: data.imageAlt,
        imageFocalPoint: data.imageFocalPoint || 'center',
        thumbnailFocalPoint: data.thumbnailFocalPoint || data.imageFocalPoint || 'center',
      } as BlogPostFrontmatter,
      content: processedContent,
      filePath,
      isMDX,
      mdxSource,
      estimatedReadTime,
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all blog post files (both .md and .mdx)
 */
function getEnhancedBlogPostFiles(): string[] {
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
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
      .map(file => path.join(year, file));
    
    files.push(...yearFiles);
  }
  
  return files;
}

/**
 * Get all enhanced blog posts with MDX support
 */
export async function getAllEnhancedPosts(): Promise<BlogPostMetadata[]> {
  const files = getEnhancedBlogPostFiles();
  const posts: BlogPostMetadata[] = [];
  
  for (const file of files) {
    const post = await parseEnhancedMarkdownFile(file);
    if (post) {
      posts.push({
        title: post.frontmatter.title,
        slug: post.frontmatter.slug,
        date: post.frontmatter.date,
        excerpt: post.frontmatter.excerpt,
        tags: post.frontmatter.tags,
        featured: post.frontmatter.featured,
        author: post.frontmatter.author,
        readTime: post.estimatedReadTime,
        filePath: post.filePath,
        image: post.frontmatter.image,
        imageAlt: post.frontmatter.imageAlt,
        imageFocalPoint: post.frontmatter.imageFocalPoint,
        thumbnailFocalPoint: post.frontmatter.thumbnailFocalPoint,
      });
    }
  }
  
  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * Get enhanced blog post by slug with MDX support
 */
export async function getEnhancedPostBySlug(slug: string): Promise<MDXBlogPost | null> {
  const files = getEnhancedBlogPostFiles();
  
  for (const file of files) {
    const post = await parseEnhancedMarkdownFile(file);
    if (post && post.frontmatter.slug === slug) {
      return post;
    }
  }
  
  return null;
}

/**
 * Get MDX posts only
 */
export async function getMDXPosts(): Promise<BlogPostMetadata[]> {
  const allPosts = await getAllEnhancedPosts();
  return allPosts.filter(post => post.filePath.endsWith('.mdx'));
}

/**
 * Get regular markdown posts only
 */
export async function getMarkdownPosts(): Promise<BlogPostMetadata[]> {
  const allPosts = await getAllEnhancedPosts();
  return allPosts.filter(post => post.filePath.endsWith('.md'));
}

/**
 * MDX Component configuration for interactive elements
 */
export const mdxComponentConfig = {
  // Component names that should be enhanced
  enhancedComponents: [
    'code', 'pre', 'h1', 'h2', 'h3', 'a', 'blockquote', 
    'ul', 'ol', 'li', 'CodeDemo', 'Photo', 'Callout',
    'VideoEmbed', 'TechDiagram', 'MetricsDisplay'
  ],
  
  // Styling configuration
  styles: {
    codeInline: {
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '0.125rem 0.25rem',
      borderRadius: '0.25rem',
      fontSize: '0.875em',
      fontFamily: 'monospace',
    },
    codeBlock: {
      background: '#0d1117',
      padding: '1rem',
      borderRadius: '0.5rem',
      overflow: 'auto',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      fontFamily: 'monospace',
      fontSize: '0.875rem',
      lineHeight: '1.5',
    },
  },
};

/**
 * Validate MDX content structure
 */
export function validateMDXContent(content: string): boolean {
  try {
    // Basic validation for MDX syntax
    const hasValidFrontmatter = content.includes('---') && content.indexOf('---') === 0;
    const hasValidJSX = !content.includes('<script>'); // Basic XSS prevention
    return hasValidFrontmatter && hasValidJSX;
  } catch (error) {
    console.error('Error validating MDX:', error);
    return false;
  }
}

/**
 * Extract custom components used in MDX content
 */
export function extractMDXComponents(content: string): string[] {
  const componentRegex = /<([A-Z][a-zA-Z0-9]*)/g;
  const matches = content.match(componentRegex);
  if (!matches) return [];
  
  return [...new Set(matches.map(match => match.slice(1)))];
}