import { promises as fs } from "fs";
import { join } from "path";
import { DocumentationQueryRequest, DocumentationQueryResult, MCPToolResponse } from "../types/schemas.js";
import { ProjectContext, DocumentationFile, DocumentationSection } from "../types/project.js";

/**
 * Query project documentation with intelligent search and context awareness
 * Provides comprehensive project guidance for Claude Code instances
 */
export async function queryDocumentationMCP(
  request: DocumentationQueryRequest,
  context: ProjectContext
) {
  const { query, category, includeExamples, format } = request;
  
  try {
    // Search documentation files
    const searchResults = await searchDocumentation(query, category, context);
    
    // Format results based on request
    const formattedResults = await formatDocumentationResults(
      searchResults,
      query,
      includeExamples,
      format,
      context
    );
    
    return formattedResults;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text",
          text: `💥 Documentation query error: ${errorMessage}\n\n🔍 **Query**: "${query}"\n📂 **Category**: ${category || 'all'}\n\n🛠️ **Troubleshooting**:\n1. Check documentation files exist in docs/ directory\n2. Try broader search terms\n3. Use specific category: testing, development, deployment\n4. Check CLAUDE.md for project overview\n\n💡 **Available categories**: testing, development, deployment, architecture, troubleshooting`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Search documentation files for relevant content
 */
async function searchDocumentation(
  query: string,
  category: string | undefined,
  context: ProjectContext
): Promise<DocumentationFile[]> {
  const documentationFiles = await loadDocumentationFiles(context);
  const results: DocumentationFile[] = [];
  
  // Filter by category if specified
  const filesToSearch = category 
    ? documentationFiles.filter(file => categorizeDocumentationFile(file.path).includes(category))
    : documentationFiles;
  
  // Search each file for relevant content
  for (const file of filesToSearch) {
    const relevantSections = await searchFileContent(file, query);
    if (relevantSections.length > 0) {
      results.push({
        ...file,
        sections: relevantSections,
      });
    }
  }
  
  // Sort by relevance
  results.sort((a, b) => calculateRelevanceScore(b, query) - calculateRelevanceScore(a, query));
  
  return results;
}

/**
 * Load available documentation files
 */
async function loadDocumentationFiles(context: ProjectContext): Promise<DocumentationFile[]> {
  const documentationFiles: DocumentationFile[] = [];
  
  // Core documentation files to check
  const coreFiles = [
    { path: "CLAUDE.md", title: "Project Instructions", description: "Main project guidance and workflows" },
    { path: "docs/TESTING.md", title: "Testing Guide", description: "Complete testing workflows and patterns" },
    { path: "docs/DEVELOPMENT.md", title: "Development Guide", description: "Daily development workflows for /2 redesign" },
    { path: "docs/DEPLOYMENT.md", title: "Deployment Guide", description: "Infrastructure and deployment procedures" },
    { path: "docs/ARCHITECTURE.md", title: "Architecture Guide", description: "Technical architecture and /2 redesign details" },
    { path: "docs/TROUBLESHOOTING.md", title: "Troubleshooting Guide", description: "Common issues and solutions" },
    { path: "docs/HOOKS.md", title: "Hooks System", description: "Claude Code hooks system automation" },
    { path: "docs/COMMANDS.md", title: "Commands Reference", description: "Essential commands for development" },
    { path: "docs/CLAUDE-WORKFLOWS.md", title: "Claude Workflows", description: "Claude Code integration patterns" },
    { path: "README.md", title: "Project README", description: "Project overview and setup" },
  ];
  
  // Check each file and load if it exists
  for (const fileInfo of coreFiles) {
    try {
      const fullPath = join(context.projectRoot, fileInfo.path);
      const content = await fs.readFile(fullPath, "utf8");
      const sections = await parseDocumentationSections(content, fileInfo.path);
      
      documentationFiles.push({
        path: fileInfo.path,
        title: fileInfo.title,
        description: fileInfo.description,
        sections,
        lastModified: await getFileModificationTime(fullPath),
      });
    } catch {
      // File doesn't exist or can't be read, skip it
    }
  }
  
  // Load additional MCP documentation if available
  try {
    const mcpDocsPath = join(context.projectRoot, "docs", "mcp");
    const mcpFiles = await fs.readdir(mcpDocsPath);
    
    for (const file of mcpFiles) {
      if (file.endsWith('.md')) {
        try {
          const fullPath = join(mcpDocsPath, file);
          const content = await fs.readFile(fullPath, "utf8");
          const sections = await parseDocumentationSections(content, `docs/mcp/${file}`);
          
          documentationFiles.push({
            path: `docs/mcp/${file}`,
            title: `MCP: ${file.replace('.md', '')}`,
            description: "MCP server documentation",
            sections,
            lastModified: await getFileModificationTime(fullPath),
          });
        } catch {
          // Skip files that can't be read
        }
      }
    }
  } catch {
    // MCP docs directory doesn't exist
  }
  
  return documentationFiles;
}

/**
 * Parse documentation sections from markdown content
 */
async function parseDocumentationSections(content: string, filePath: string): Promise<DocumentationSection[]> {
  const lines = content.split('\n');
  const sections: DocumentationSection[] = [];
  let currentSection: DocumentationSection | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for headers (## or ###)
    const headerMatch = line.match(/^(#{2,3})\s+(.+)$/);
    if (headerMatch) {
      // Save previous section
      if (currentSection) {
        currentSection.lineEnd = i - 1;
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        title: headerMatch[2],
        content: "",
        lineStart: i,
        lineEnd: i,
        tags: extractTags(headerMatch[2], filePath),
      };
    } else if (currentSection) {
      // Add content to current section
      currentSection.content += line + '\n';
    }
  }
  
  // Save final section
  if (currentSection) {
    currentSection.lineEnd = lines.length - 1;
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Extract tags from section title and file path for categorization
 */
function extractTags(title: string, filePath: string): string[] {
  const tags: string[] = [];
  
  // File-based tags
  if (filePath.includes('TESTING')) tags.push('testing');
  if (filePath.includes('DEVELOPMENT')) tags.push('development');
  if (filePath.includes('DEPLOYMENT')) tags.push('deployment');
  if (filePath.includes('ARCHITECTURE')) tags.push('architecture');
  if (filePath.includes('TROUBLESHOOTING')) tags.push('troubleshooting');
  if (filePath.includes('HOOKS')) tags.push('hooks', 'automation');
  if (filePath.includes('COMMANDS')) tags.push('commands', 'reference');
  if (filePath.includes('CLAUDE-WORKFLOWS')) tags.push('claude', 'workflows');
  if (filePath.includes('mcp')) tags.push('mcp', 'server');
  
  // Title-based tags
  const titleLower = title.toLowerCase();
  if (titleLower.includes('test')) tags.push('testing');
  if (titleLower.includes('dev')) tags.push('development');
  if (titleLower.includes('deploy')) tags.push('deployment');
  if (titleLower.includes('troubleshoot') || titleLower.includes('error')) tags.push('troubleshooting');
  if (titleLower.includes('command')) tags.push('commands');
  if (titleLower.includes('npm') || titleLower.includes('script')) tags.push('commands');
  if (titleLower.includes('hook')) tags.push('hooks');
  if (titleLower.includes('claude')) tags.push('claude');
  if (titleLower.includes('timeout')) tags.push('troubleshooting', 'timeout');
  if (titleLower.includes('port')) tags.push('environment', 'setup');
  if (titleLower.includes('/2')) tags.push('redesign');
  
  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Search file content for relevant sections
 */
async function searchFileContent(file: DocumentationFile, query: string): Promise<DocumentationSection[]> {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
  const relevantSections: DocumentationSection[] = [];
  
  for (const section of file.sections) {
    const relevanceScore = calculateSectionRelevance(section, queryWords, queryLower);
    if (relevanceScore > 0) {
      relevantSections.push(section);
    }
  }
  
  // Sort sections by relevance within the file
  relevantSections.sort((a, b) => 
    calculateSectionRelevance(b, queryWords, queryLower) - 
    calculateSectionRelevance(a, queryWords, queryLower)
  );
  
  return relevantSections;
}

/**
 * Calculate relevance score for a section
 */
function calculateSectionRelevance(section: DocumentationSection, queryWords: string[], queryLower: string): number {
  let score = 0;
  const titleLower = section.title.toLowerCase();
  const contentLower = section.content.toLowerCase();
  
  // Exact query match in title (highest score)
  if (titleLower.includes(queryLower)) {
    score += 10;
  }
  
  // Individual words in title
  for (const word of queryWords) {
    if (titleLower.includes(word)) {
      score += 5;
    }
  }
  
  // Exact query match in content
  if (contentLower.includes(queryLower)) {
    score += 3;
  }
  
  // Individual words in content
  for (const word of queryWords) {
    const matches = (contentLower.match(new RegExp(word, 'g')) || []).length;
    score += matches * 1;
  }
  
  // Tag matches
  for (const tag of section.tags) {
    if (queryWords.includes(tag)) {
      score += 2;
    }
  }
  
  return score;
}

/**
 * Calculate overall relevance score for a file
 */
function calculateRelevanceScore(file: DocumentationFile, query: string): number {
  return file.sections.reduce((total, section) => {
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    return total + calculateSectionRelevance(section, queryWords, query.toLowerCase());
  }, 0);
}

/**
 * Categorize documentation file by path
 */
function categorizeDocumentationFile(filePath: string): string[] {
  const categories: string[] = [];
  
  if (filePath.includes('TESTING')) categories.push('testing');
  if (filePath.includes('DEVELOPMENT')) categories.push('development');
  if (filePath.includes('DEPLOYMENT')) categories.push('deployment');
  if (filePath.includes('ARCHITECTURE')) categories.push('architecture');
  if (filePath.includes('TROUBLESHOOTING')) categories.push('troubleshooting');
  if (filePath.includes('HOOKS')) categories.push('automation');
  if (filePath.includes('COMMANDS')) categories.push('reference');
  if (filePath.includes('CLAUDE-WORKFLOWS')) categories.push('workflows');
  if (filePath.includes('mcp')) categories.push('mcp');
  if (filePath.includes('CLAUDE.md')) categories.push('overview');
  
  return categories;
}

/**
 * Get file modification time
 */
async function getFileModificationTime(filePath: string): Promise<Date> {
  try {
    const stats = await fs.stat(filePath);
    return stats.mtime;
  } catch {
    return new Date();
  }
}

/**
 * Format documentation results for Claude Code response
 */
async function formatDocumentationResults(
  results: DocumentationFile[],
  query: string,
  includeExamples: boolean,
  format: string,
  context: ProjectContext
): Promise<MCPToolResponse> {
  if (results.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `📚 No documentation found for: "${query}"\n\n🔍 **Search Results**: No matches found\n\n💡 **Suggestions**:\n- Try broader search terms: "test", "dev", "deploy"\n- Check specific categories: testing, development, deployment\n- Browse available documentation files\n\n📂 **Available Documentation**:\n- CLAUDE.md: Project overview and workflows\n- docs/TESTING.md: Testing strategies and commands\n- docs/DEVELOPMENT.md: Daily development patterns\n- docs/DEPLOYMENT.md: Infrastructure and deployment\n- docs/TROUBLESHOOTING.md: Common issues and solutions\n\n🎯 **Quick access**: Use category-specific queries like "testing commands" or "development setup"`,
        },
      ],
    };
  }
  
  const totalSections = results.reduce((sum, file) => sum + file.sections.length, 0);
  
  if (format === "summary") {
    return formatSummaryResults(results, query, totalSections);
  } else {
    return formatDetailedResults(results, query, includeExamples, totalSections, context);
  }
}

/**
 * Format summary results
 */
function formatSummaryResults(
  results: DocumentationFile[],
  query: string,
  totalSections: number
): MCPToolResponse {
  const fileList = results.map(file => 
    `- **${file.title}** (${file.sections.length} section${file.sections.length > 1 ? 's' : ''}): ${file.description}`
  ).join('\n');
  
  const topSections = results
    .flatMap(file => file.sections.slice(0, 2).map(section => ({
      ...section,
      filePath: file.path,
      fileTitle: file.title,
    })))
    .slice(0, 5);
  
  const sectionList = topSections.map(section => 
    `- **${section.title}** (${section.fileTitle})`
  ).join('\n');
  
  return {
    content: [
      {
        type: "text",
        text: `📚 Documentation Search Results: "${query}"\n\n📊 **Summary**:\n- ${results.length} relevant file${results.length > 1 ? 's' : ''} found\n- ${totalSections} matching section${totalSections > 1 ? 's' : ''}\n\n📂 **Relevant Files**:\n${fileList}\n\n🎯 **Top Sections**:\n${sectionList}\n\n💡 **For detailed content**: Use queryDocumentationMCP with format="detailed"\n\n🚀 **Quick actions**:\n- Get specific file: Read the full documentation file\n- Browse category: Use category parameter (testing, development, etc.)\n- Search examples: Add includeExamples=true`,
      },
    ],
  };
}

/**
 * Format detailed results
 */
function formatDetailedResults(
  results: DocumentationFile[],
  query: string,
  includeExamples: boolean,
  totalSections: number,
  context: ProjectContext
): MCPToolResponse {
  let content = `📚 Documentation Results: "${query}"\n\n📊 **Found**: ${results.length} file${results.length > 1 ? 's' : ''}, ${totalSections} section${totalSections > 1 ? 's' : ''}\n\n`;
  
  // Show detailed results for top files
  for (let i = 0; i < Math.min(results.length, 3); i++) {
    const file = results[i];
    content += `## 📖 ${file.title}\n\n`;
    
    if (file.description) {
      content += `**Description**: ${file.description}\n\n`;
    }
    
    // Show top sections from this file
    for (let j = 0; j < Math.min(file.sections.length, 3); j++) {
      const section = file.sections[j];
      content += `### ${section.title}\n\n`;
      
      // Show relevant excerpt from content
      const excerpt = extractRelevantExcerpt(section.content, query, 200);
      if (excerpt) {
        content += `${excerpt}\n\n`;
      }
      
      if (includeExamples) {
        const examples = extractCodeExamples(section.content);
        if (examples.length > 0) {
          content += `**Examples**:\n${examples.slice(0, 2).join('\n\n')}\n\n`;
        }
      }
      
      content += `📁 *Source: ${file.path}:${section.lineStart}*\n\n`;
    }
    
    if (file.sections.length > 3) {
      content += `*... and ${file.sections.length - 3} more section${file.sections.length - 3 > 1 ? 's' : ''}*\n\n`;
    }
    
    content += `---\n\n`;
  }
  
  if (results.length > 3) {
    content += `*... and ${results.length - 3} more file${results.length - 3 > 1 ? 's' : ''} with relevant content*\n\n`;
  }
  
  content += `💡 **Next steps**:\n- Read full files: Use handleFileOperationMCP with operation "read"\n- Run commands: Many sections contain executable commands\n- Get help: Use more specific queries for targeted guidance\n\n🎯 **Context**: ${context.developmentContext} development, ${context.environment} environment`;
  
  return {
    content: [
      {
        type: "text",
        text: content,
      },
    ],
  };
}

/**
 * Extract relevant excerpt from content
 */
function extractRelevantExcerpt(content: string, query: string, maxLength: number): string {
  const queryLower = query.toLowerCase();
  const lines = content.split('\n');
  
  // Find lines containing query terms
  const relevantLines: string[] = [];
  for (const line of lines) {
    if (line.toLowerCase().includes(queryLower)) {
      relevantLines.push(line.trim());
      if (relevantLines.join(' ').length > maxLength) {
        break;
      }
    }
  }
  
  if (relevantLines.length > 0) {
    let excerpt = relevantLines.join(' ');
    if (excerpt.length > maxLength) {
      excerpt = excerpt.substring(0, maxLength) + '...';
    }
    return excerpt;
  }
  
  // Fallback to first few lines
  const firstLines = lines.slice(0, 3).join(' ').trim();
  if (firstLines.length > maxLength) {
    return firstLines.substring(0, maxLength) + '...';
  }
  
  return firstLines;
}

/**
 * Extract code examples from content
 */
function extractCodeExamples(content: string): string[] {
  const examples: string[] = [];
  const codeBlockRegex = /```[\s\S]*?```/g;
  const matches = content.match(codeBlockRegex);
  
  if (matches) {
    examples.push(...matches.slice(0, 3)); // Limit to 3 examples
  }
  
  return examples;
}