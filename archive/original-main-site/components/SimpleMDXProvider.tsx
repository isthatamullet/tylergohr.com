"use client";

import { MDXProvider } from '@mdx-js/react';
import { ReactNode } from 'react';

interface SimpleMDXProviderProps {
  children: ReactNode;
}

// Simple MDX components without TypeScript issues
const components = {
  wrapper: ({ children }: { children: ReactNode }) => (
    <div style={{ color: '#fff', lineHeight: 1.7 }}>{children}</div>
  ),
};

export default function SimpleMDXProvider({ children }: SimpleMDXProviderProps) {
  return (
    <MDXProvider components={components}>
      {children}
    </MDXProvider>
  );
}