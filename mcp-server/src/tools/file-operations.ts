import { promises as fs } from "fs";
import { join, dirname, basename } from "path";
import { FileOperationRequest, FileOperationResult, MCPToolResponse } from "../types/schemas.js";
import { ProjectContext, ProtectedFile, ProtectionLevel } from "../types/project.js";

/**
 * Handle file operations with intelligent protection and validation
 * Replaces hooks file protection system with TypeScript implementation
 */
export async function handleFileOperationMCP(
  request: FileOperationRequest,
  context: ProjectContext
) {
  const { operation, filePath, content, backup, force } = request;
  
  try {
    // Normalize file path
    const normalizedPath = filePath.startsWith('/') ? filePath : join(context.projectRoot, filePath);
    
    // Check file protection
    const protectionCheck = await checkFileProtection(normalizedPath, context);
    
    if (protectionCheck.isProtected && !force) {
      return {
        content: [
          {
            type: "text",
            text: `🛡️ Protected file operation blocked\n\n📁 **File**: ${filePath}\n🔒 **Protection Level**: ${protectionCheck.protection?.level}\n⚠️ **Reason**: ${protectionCheck.protection?.reason}\n\n${protectionCheck.protection?.requiresConfirmation ? "🤔 **Confirmation Required**: This file requires explicit confirmation before modification" : ""}\n\n🛠️ **To proceed**:\n1. Review the protection reason carefully\n2. Use handleFileOperationMCP with force=true if you're certain\n3. Consider backup=true for important files\n\n💡 **Alternative**: Ask user for explicit permission to modify this protected file\n\n📋 **Protection Details**:\n- Level: ${protectionCheck.protection?.level}\n- Backup recommended: ${protectionCheck.protection?.backupRecommended ? 'Yes' : 'No'}\n- File type: ${getFileType(filePath)}`,
          },
        ],
        isError: true,
      };
    }
    
    // Perform the requested operation
    const result = await performFileOperation(operation, normalizedPath, content, backup, context);
    
    return formatFileOperationResult(result, operation, filePath, protectionCheck, context);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      content: [
        {
          type: "text",
          text: `💥 File operation error: ${errorMessage}\n\n🔍 **Context**:\n- Operation: ${operation}\n- File: ${filePath}\n- Force: ${force}\n- Backup: ${backup}\n\n🛠️ **Troubleshooting**:\n1. Check file exists for read/modify operations\n2. Verify write permissions for the directory\n3. Ensure valid file path format\n4. Use force=true for protected files (with caution)`,
        },
      ],
      isError: true,
    };
  }
}

/**
 * Check if file is protected and get protection information
 */
async function checkFileProtection(
  filePath: string,
  context: ProjectContext
): Promise<{ isProtected: boolean; protection?: ProtectedFile }> {
  try {
    // Load protection configuration
    const protectedFiles = await loadProtectedFiles(context);
    
    // Check against protection patterns
    for (const protectedFile of protectedFiles) {
      if (isFileMatchingPattern(filePath, protectedFile.path, context.projectRoot)) {
        return {
          isProtected: true,
          protection: protectedFile,
        };
      }
    }
    
    return { isProtected: false };
    
  } catch {
    // If we can't load protection config, use built-in patterns
    const builtinProtection = getBuiltinProtection(filePath, context.projectRoot);
    return {
      isProtected: builtinProtection !== null,
      protection: builtinProtection || undefined,
    };
  }
}

/**
 * Load protected files configuration
 */
async function loadProtectedFiles(context: ProjectContext): Promise<ProtectedFile[]> {
  try {
    const configPath = join(context.projectRoot, "scripts", "hooks", "config", "protected-files.json");
    const configContent = await fs.readFile(configPath, "utf8");
    const config = JSON.parse(configContent);
    
    const protectedFiles: ProtectedFile[] = [];
    
    // Process each protection level
    for (const [level, files] of Object.entries(config.protection_levels)) {
      if (Array.isArray(files)) {
        for (const fileInfo of files) {
          protectedFiles.push({
            path: fileInfo.pattern || fileInfo.path,
            level: level as ProtectionLevel,
            reason: fileInfo.reason || `Protected ${level} file`,
            requiresConfirmation: fileInfo.requires_confirmation !== false,
            backupRecommended: fileInfo.backup_recommended !== false,
          });
        }
      }
    }
    
    return protectedFiles;
  } catch {
    // Fallback to built-in protection patterns
    return getBuiltinProtectedFiles();
  }
}

/**
 * Get built-in protection patterns
 */
function getBuiltinProtectedFiles(): ProtectedFile[] {
  return [
    // Critical files
    {
      path: "package.json",
      level: "critical",
      reason: "Package configuration and dependencies",
      requiresConfirmation: true,
      backupRecommended: true,
    },
    {
      path: "package-lock.json",
      level: "critical",
      reason: "Dependency lock file - regenerated by npm",
      requiresConfirmation: true,
      backupRecommended: false,
    },
    {
      path: "next.config.js",
      level: "critical",
      reason: "Next.js build configuration",
      requiresConfirmation: true,
      backupRecommended: true,
    },
    {
      path: "tsconfig.json",
      level: "critical",
      reason: "TypeScript configuration",
      requiresConfirmation: true,
      backupRecommended: true,
    },
    {
      path: "playwright.config.ts",
      level: "critical",
      reason: "Playwright testing configuration",
      requiresConfirmation: true,
      backupRecommended: true,
    },
    
    // Important files
    {
      path: "CLAUDE.md",
      level: "important",
      reason: "Project instructions and documentation",
      requiresConfirmation: true,
      backupRecommended: true,
    },
    {
      path: "README.md",
      level: "important",
      reason: "Project documentation",
      requiresConfirmation: true,
      backupRecommended: true,
    },
    {
      path: "Dockerfile",
      level: "important",
      reason: "Container configuration",
      requiresConfirmation: true,
      backupRecommended: true,
    },
    
    // Design system files
    {
      path: "src/app/2/styles/brand-tokens.css",
      level: "design_system",
      reason: "Core /2 redesign design system",
      requiresConfirmation: true,
      backupRecommended: true,
    },
    {
      path: "src/app/globals.css",
      level: "design_system",
      reason: "Global stylesheet",
      requiresConfirmation: true,
      backupRecommended: true,
    },
    
    // Configuration files
    {
      path: ".env*",
      level: "configuration",
      reason: "Environment variables and secrets",
      requiresConfirmation: true,
      backupRecommended: true,
    },
    {
      path: "eslint.config.js",
      level: "configuration",
      reason: "ESLint configuration",
      requiresConfirmation: false,
      backupRecommended: true,
    },
    {
      path: "postcss.config.js",
      level: "configuration",
      reason: "PostCSS configuration",
      requiresConfirmation: false,
      backupRecommended: true,
    },
  ];
}

/**
 * Get built-in protection for a specific file
 */
function getBuiltinProtection(filePath: string, projectRoot: string): ProtectedFile | null {
  const protectedFiles = getBuiltinProtectedFiles();
  
  for (const protectedFile of protectedFiles) {
    if (isFileMatchingPattern(filePath, protectedFile.path, projectRoot)) {
      return protectedFile;
    }
  }
  
  return null;
}

/**
 * Check if file matches protection pattern
 */
function isFileMatchingPattern(filePath: string, pattern: string, projectRoot: string): boolean {
  // Normalize paths
  const normalizedFilePath = filePath.replace(projectRoot, '').replace(/^\//, '');
  const normalizedPattern = pattern.replace(/^\//, '');
  
  // Handle glob patterns
  if (pattern.includes('*')) {
    const regexPattern = normalizedPattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(normalizedFilePath);
  }
  
  // Exact match
  return normalizedFilePath === normalizedPattern || 
         filePath.endsWith(pattern) ||
         basename(filePath) === pattern;
}

/**
 * Perform the actual file operation
 */
async function performFileOperation(
  operation: string,
  filePath: string,
  content: string | undefined,
  backup: boolean,
  context: ProjectContext
): Promise<FileOperationResult> {
  const startTime = Date.now();
  let backupPath: string | undefined;
  
  try {
    // Create backup if requested and file exists
    if (backup && (operation === "modify" || operation === "delete")) {
      try {
        await fs.access(filePath);
        backupPath = await createBackup(filePath);
      } catch {
        // File doesn't exist, no backup needed
      }
    }
    
    switch (operation) {
      case "read":
        const readContent = await fs.readFile(filePath, "utf8");
        return {
          operation,
          filePath,
          success: true,
          duration: Date.now() - startTime,
          content: readContent,
          backupPath,
        };
        
      case "create":
        if (!content) {
          throw new Error("Content is required for create operation");
        }
        
        // Ensure directory exists
        await fs.mkdir(dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content, "utf8");
        
        return {
          operation,
          filePath,
          success: true,
          duration: Date.now() - startTime,
          content,
          backupPath,
        };
        
      case "modify":
        if (!content) {
          throw new Error("Content is required for modify operation");
        }
        
        await fs.writeFile(filePath, content, "utf8");
        
        return {
          operation,
          filePath,
          success: true,
          duration: Date.now() - startTime,
          content,
          backupPath,
        };
        
      case "delete":
        await fs.unlink(filePath);
        
        return {
          operation,
          filePath,
          success: true,
          duration: Date.now() - startTime,
          backupPath,
        };
        
      case "exists":
        try {
          await fs.access(filePath);
          return {
            operation,
            filePath,
            success: true,
            duration: Date.now() - startTime,
            exists: true,
          };
        } catch {
          return {
            operation,
            filePath,
            success: true,
            duration: Date.now() - startTime,
            exists: false,
          };
        }
        
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      operation,
      filePath,
      success: false,
      duration: Date.now() - startTime,
      error: errorMessage,
      backupPath,
    };
  }
}

/**
 * Create backup of file
 */
async function createBackup(filePath: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup-${timestamp}`;
  
  await fs.copyFile(filePath, backupPath);
  return backupPath;
}

/**
 * Get file type for display purposes
 */
function getFileType(filePath: string): string {
  const ext = basename(filePath).split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'TypeScript';
    case 'js':
    case 'jsx':
      return 'JavaScript';
    case 'css':
      return 'Stylesheet';
    case 'json':
      return 'JSON Configuration';
    case 'md':
      return 'Markdown';
    case 'yml':
    case 'yaml':
      return 'YAML Configuration';
    default:
      return ext ? `${ext.toUpperCase()} file` : 'Unknown file type';
  }
}

/**
 * Format file operation result for Claude Code response
 */
function formatFileOperationResult(
  result: FileOperationResult,
  operation: string,
  filePath: string,
  protectionCheck: { isProtected: boolean; protection?: ProtectedFile },
  context: ProjectContext
): MCPToolResponse {
  const { success, duration, content, backupPath, exists, error } = result;
  const durationMs = duration.toFixed(0);
  
  if (success) {
    let operationText = "";
    
    switch (operation) {
      case "read":
        operationText = `📖 File read successfully\n\n📁 **File**: ${filePath}\n📝 **Content length**: ${content?.length || 0} characters\n⏱️ **Duration**: ${durationMs}ms`;
        break;
        
      case "create":
        operationText = `✨ File created successfully\n\n📁 **File**: ${filePath}\n📝 **Content length**: ${content?.length || 0} characters\n⏱️ **Duration**: ${durationMs}ms`;
        break;
        
      case "modify":
        operationText = `✏️ File modified successfully\n\n📁 **File**: ${filePath}\n📝 **Content length**: ${content?.length || 0} characters\n⏱️ **Duration**: ${durationMs}ms`;
        break;
        
      case "delete":
        operationText = `🗑️ File deleted successfully\n\n📁 **File**: ${filePath}\n⏱️ **Duration**: ${durationMs}ms`;
        break;
        
      case "exists":
        operationText = `🔍 File existence check\n\n📁 **File**: ${filePath}\n✅ **Exists**: ${exists ? 'Yes' : 'No'}\n⏱️ **Duration**: ${durationMs}ms`;
        break;
    }
    
    const protectionText = protectionCheck.isProtected 
      ? `\n\n🛡️ **Protection Override**: Protected file modified with force=true\n- Level: ${protectionCheck.protection?.level}\n- Reason: ${protectionCheck.protection?.reason}`
      : "";
      
    const backupText = backupPath 
      ? `\n\n💾 **Backup created**: ${backupPath}`
      : "";
    
    return {
      content: [
        {
          type: "text",
          text: `${operationText}${protectionText}${backupText}\n\n🎯 **Operation completed successfully!**\n\n💡 **Next steps**:\n- Validate changes: validateQualityGatesMCP\n- Run tests: executeTestMCP with testType "smoke"\n- Check file: handleFileOperationMCP with operation "read"`,
        },
      ],
    };
  } else {
    return {
      content: [
        {
          type: "text",
          text: `❌ File operation failed\n\n📁 **File**: ${filePath}\n🔧 **Operation**: ${operation}\n❌ **Error**: ${error}\n⏱️ **Duration**: ${durationMs}ms\n\n🛠️ **Troubleshooting**:\n1. Check file permissions and path validity\n2. Ensure directory exists for create operations\n3. Verify file exists for read/modify/delete operations\n4. Use force=true for protected files (with caution)\n\n💡 **Common issues**:\n- Path not found: Check file path spelling and existence\n- Permission denied: Verify write permissions\n- Protected file: Use force=true or get user permission`,
        },
      ],
      isError: true,
    };
  }
}