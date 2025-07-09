"use client";

import { MDXProvider as BaseMDXProvider } from '@mdx-js/react';
import { ReactNode } from 'react';
import CodeDemo from './CodeDemo';
import PhotoCard from './PhotoCard';
import { mdxComponentConfig } from '@/lib/mdx-blog';
import styles from './MDXProvider.module.css';
import type {
  CodeDemoProps,
  PhotoProps,
  CalloutProps,
  VideoEmbedProps,
  TechDiagramProps,
  MetricsDisplayProps,
  MDXWrapperProps
} from './MDXProvider.types';

interface MDXProviderProps {
  children: ReactNode;
}

// Enhanced MDX components for blog posts  
const enhancedMDXComponents = {
  // Base HTML elements with styling
  code: (props: React.HTMLProps<HTMLElement>) => {
    if (typeof props.children === 'string') {
      return (
        <code 
          className="inline-code" 
          style={mdxComponentConfig.styles.codeInline}
          {...props} 
        />
      );
    }
    return <code {...props} />;
  },
  
  pre: (props: React.HTMLProps<HTMLPreElement>) => (
    <pre style={mdxComponentConfig.styles.codeBlock} {...props} />
  ),
  
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => <h1 style={{ color: '#fff', marginBottom: '1rem' }} {...props} />,
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => <h2 style={{ color: '#fff', marginBottom: '0.75rem', marginTop: '2rem' }} {...props} />,
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => <h3 style={{ color: '#fff', marginBottom: '0.5rem', marginTop: '1.5rem' }} {...props} />,
  
  a: (props: React.HTMLProps<HTMLAnchorElement>) => (
    <a 
      style={{ 
        color: '#16a34a', 
        textDecoration: 'underline',
        textDecorationColor: 'rgba(22, 163, 74, 0.5)',
      }} 
      {...props} 
    />
  ),
  
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote 
      style={{
        borderLeft: '4px solid #16a34a',
        paddingLeft: '1rem',
        margin: '1rem 0',
        fontStyle: 'italic',
        color: 'rgba(255, 255, 255, 0.8)',
        background: 'rgba(22, 163, 74, 0.05)',
        padding: '1rem',
        borderRadius: '0.5rem',
      }}
      {...props} 
    />
  ),
  
  ul: (props: React.HTMLProps<HTMLUListElement>) => <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }} {...props} />,
  ol: (props: React.HTMLProps<HTMLOListElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type: _type, ...restProps } = props;
    return <ol style={{ margin: '1rem 0', paddingLeft: '1.5rem' }} {...restProps} />;
  },
  li: (props: React.HTMLProps<HTMLLIElement>) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
  
  // Interactive Code Demo component
  CodeDemo: (props: CodeDemoProps) => (
    <div className={styles.interactiveComponent}>
      <CodeDemo 
        codeExample={{
          id: props.id || 'inline-demo',
          title: props.title || 'Code Example',
          description: props.description || 'Interactive code demonstration',
          language: props.language || 'typescript',
          code: props.code || props.children || '',
          explanation: props.explanation,
          highlightLines: props.highlightLines,
        }}
        enableModeSwitch={props.interactive !== false}
        autoType={props.autoType !== false}
        mode={props.mode || 'preview'}
      />
    </div>
  ),
  
  // Photo component for embedding in blog posts
  Photo: (props: PhotoProps) => (
    <div className={styles.photoEmbed}>
      <PhotoCard
        photo={{
          id: props.id || 'blog-photo',
          title: props.title || 'Blog Image',
          description: props.description,
          category: props.category || 'blog',
          filename: props.src,
          alt: props.alt || props.title || 'Blog image',
          width: props.width || 800,
          height: props.height || 600,
          caption: props.caption,
          tags: props.tags ? props.tags.split(',').map((tag: string) => tag.trim()) : [],
          featured: props.featured === true,
        }}
        showMetadata={props.showMetadata === true}
        priority={props.priority === true}
      />
    </div>
  ),
  
  // Callout component for highlighting important information
  Callout: ({ type = 'info', children, title }: CalloutProps) => (
    <div className={`${styles.callout} ${styles[`callout-${type}`]}`}>
      {title && <div className={styles.calloutTitle}>{title}</div>}
      <div className={styles.calloutContent}>{children}</div>
    </div>
  ),
  
  // Video embed component
  VideoEmbed: (props: VideoEmbedProps) => (
    <div className={styles.videoEmbed}>
      <iframe
        src={props.src}
        title={props.title || 'Video'}
        width="100%"
        height="400"
        frameBorder="0"
        allowFullScreen
        loading="lazy"
        className={styles.video}
      />
      {props.caption && (
        <div className={styles.videoCaption}>{props.caption}</div>
      )}
    </div>
  ),
  
  // Technical diagram component
  TechDiagram: ({ children, title }: TechDiagramProps) => (
    <figure className={styles.techDiagram}>
      <div className={styles.diagramContent}>
        {children}
      </div>
      {title && <figcaption className={styles.diagramTitle}>{title}</figcaption>}
    </figure>
  ),
  
  // Metrics display component
  MetricsDisplay: ({ metrics, title }: MetricsDisplayProps) => (
    <div className={styles.metricsDisplay}>
      {title && <h3 className={styles.metricsTitle}>{title}</h3>}
      <div className={styles.metricsGrid}>
        {metrics.map((metric, index: number) => (
          <div key={index} className={styles.metricCard}>
            <div className={styles.metricValue}>{metric.value}</div>
            <div className={styles.metricLabel}>{metric.label}</div>
            {metric.improvement && (
              <div className={styles.metricImprovement}>
                {metric.improvement}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ),
  
  // Enhanced wrapper components
  wrapper: ({ children }: MDXWrapperProps) => (
    <div className={styles.mdxContent}>{children}</div>
  ),
};

export default function MDXProvider({ children }: MDXProviderProps) {
  return (
    <BaseMDXProvider components={enhancedMDXComponents}>
      {children}
    </BaseMDXProvider>
  );
}