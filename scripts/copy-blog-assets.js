const fs = require('fs');
const path = require('path');

/**
 * Copy blog assets from content/blog/assets to public/images/blog
 * This ensures images are available in the public directory for Next.js Image optimization
 */

const ASSETS_SOURCE = path.join(process.cwd(), 'content', 'blog', 'assets');
const ASSETS_DEST = path.join(process.cwd(), 'public', 'images', 'blog');

// Supported image formats for blog images
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

function isSupportedImageFormat(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return SUPPORTED_FORMATS.includes(ext);
}

function validateImageFile(filePath) {
  try {
    const stats = fs.statSync(filePath);
    
    // Check file size (warn if > 5MB, error if > 20MB)
    const fileSizeMB = stats.size / (1024 * 1024);
    if (fileSizeMB > 20) {
      return { valid: false, error: `File too large: ${fileSizeMB.toFixed(1)}MB (max 20MB)` };
    }
    if (fileSizeMB > 5) {
      console.warn(`⚠️  Large file detected: ${path.basename(filePath)} (${fileSizeMB.toFixed(1)}MB) - consider optimizing`);
    }
    
    // Check if file is readable
    fs.accessSync(filePath, fs.constants.R_OK);
    
    return { valid: true, size: fileSizeMB };
  } catch (error) {
    return { valid: false, error: `Cannot read file: ${error.message}` };
  }
}

function copyBlogAssets() {
  console.log('🎨 Copying blog assets...');
  
  // Ensure source directory exists
  if (!fs.existsSync(ASSETS_SOURCE)) {
    console.log(`⚠️  Source directory does not exist: ${ASSETS_SOURCE}`);
    console.log('✅ No blog assets to copy. This is normal if no images have been added yet.');
    return;
  }

  // Ensure destination directory exists
  ensureDirectoryExists(ASSETS_DEST);

  // Read source directory with error handling
  let files;
  try {
    files = fs.readdirSync(ASSETS_SOURCE);
  } catch (error) {
    console.error(`❌ Cannot read assets directory: ${error.message}`);
    process.exit(1);
  }
  
  const imageFiles = files.filter(isSupportedImageFormat);
  const unsupportedFiles = files.filter(file => !isSupportedImageFormat(file) && !file.startsWith('.'));
  
  // Warn about unsupported files
  if (unsupportedFiles.length > 0) {
    console.warn(`⚠️  Unsupported files found (will be ignored): ${unsupportedFiles.join(', ')}`);
    console.warn(`   Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
  }

  if (imageFiles.length === 0) {
    console.log('✅ No image files found in assets directory. Ready for future images.');
    return;
  }

  let copiedCount = 0;
  let errorCount = 0;

  imageFiles.forEach(file => {
    const sourcePath = path.join(ASSETS_SOURCE, file);
    const destPath = path.join(ASSETS_DEST, file);

    // Validate image file first
    const validation = validateImageFile(sourcePath);
    if (!validation.valid) {
      console.error(`❌ Invalid image ${file}: ${validation.error}`);
      errorCount++;
      return;
    }

    try {
      // Check if file needs copying (source is newer or dest doesn't exist)
      let shouldCopy = true;
      
      if (fs.existsSync(destPath)) {
        const sourceStats = fs.statSync(sourcePath);
        const destStats = fs.statSync(destPath);
        shouldCopy = sourceStats.mtime > destStats.mtime;
      }

      if (shouldCopy) {
        // Verify destination directory is writable
        fs.accessSync(ASSETS_DEST, fs.constants.W_OK);
        
        fs.copyFileSync(sourcePath, destPath);
        console.log(`📋 Copied: ${file} (${validation.size.toFixed(1)}MB) → public/images/blog/`);
        copiedCount++;
      } else {
        console.log(`⏭️  Skipped: ${file} (up to date)`);
      }
    } catch (error) {
      console.error(`❌ Error copying ${file}: ${error.message}`);
      errorCount++;
      // Continue with other files instead of exiting
    }
  });

  // Summary with error handling
  if (errorCount > 0) {
    console.warn(`⚠️  Completed with ${errorCount} error(s). ${copiedCount} files copied successfully.`);
    if (errorCount === imageFiles.length) {
      console.error('❌ All image operations failed. Check file permissions and disk space.');
      process.exit(1);
    }
  } else {
    console.log(`✅ Blog asset copying complete. ${copiedCount} files copied, ${imageFiles.length - copiedCount} skipped.`);
  }
}

// Run the script
if (require.main === module) {
  copyBlogAssets();
}

module.exports = { copyBlogAssets };