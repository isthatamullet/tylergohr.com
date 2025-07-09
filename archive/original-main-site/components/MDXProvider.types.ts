// MDX Component Type Definitions
import { ReactNode } from 'react';

export interface CodeDemoProps {
  id?: string;
  title?: string;
  description?: string;
  language?: string;
  code?: string;
  children?: string;
  explanation?: string;
  highlightLines?: number[];
  interactive?: boolean;
  autoType?: boolean;
  mode?: 'preview' | 'interactive';
}

export interface PhotoProps {
  id?: string;
  src: string;
  title?: string;
  description?: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
  category?: 'professional' | 'projects' | 'behind-scenes' | 'blog';
  tags?: string;
  featured?: boolean;
  showMetadata?: boolean;
  priority?: boolean;
}

export interface CalloutProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
}

export interface VideoEmbedProps {
  src: string;
  title?: string;
  caption?: string;
  width?: string | number;
  height?: string | number;
}

export interface TechDiagramProps {
  title?: string;
  children: ReactNode;
}

export interface MetricData {
  label: string;
  value: string;
  improvement?: string;
}

export interface MetricsDisplayProps {
  title?: string;
  metrics: MetricData[];
}

export interface MDXWrapperProps {
  children: ReactNode;
}