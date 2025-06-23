// Blog System - TypeScript Interfaces

export interface BlogPostFrontmatter {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  tags: string[];
  featured: boolean;
  author: string;
  readTime: string;
}

export interface BlogPost {
  frontmatter: BlogPostFrontmatter;
  content: string;
  filePath: string;
}

export interface BlogPostMetadata {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  tags: string[];
  featured: boolean;
  author: string;
  readTime: string;
  filePath: string;
}

export interface BlogListingProps {
  posts: BlogPostMetadata[];
  featured?: boolean;
  tag?: string;
  limit?: number;
}

export interface BlogPostPageProps {
  post: BlogPost;
  relatedPosts?: BlogPostMetadata[];
}

export interface BlogTagInfo {
  tag: string;
  count: number;
  posts: BlogPostMetadata[];
}