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

  // Read source directory
  const files = fs.readdirSync(ASSETS_SOURCE);
  const imageFiles = files.filter(isSupportedImageFormat);

  if (imageFiles.length === 0) {
    console.log('✅ No image files found in assets directory. Ready for future images.');
    return;
  }

  let copiedCount = 0;

  imageFiles.forEach(file => {
    const sourcePath = path.join(ASSETS_SOURCE, file);
    const destPath = path.join(ASSETS_DEST, file);

    try {
      // Check if file needs copying (source is newer or dest doesn't exist)
      let shouldCopy = true;
      
      if (fs.existsSync(destPath)) {
        const sourceStats = fs.statSync(sourcePath);
        const destStats = fs.statSync(destPath);
        shouldCopy = sourceStats.mtime > destStats.mtime;
      }

      if (shouldCopy) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`📋 Copied: ${file} → public/images/blog/`);
        copiedCount++;
      } else {
        console.log(`⏭️  Skipped: ${file} (up to date)`);
      }
    } catch (error) {
      console.error(`❌ Error copying ${file}:`, error.message);
      process.exit(1);
    }
  });

  console.log(`✅ Blog asset copying complete. ${copiedCount} files copied, ${imageFiles.length - copiedCount} skipped.`);
}

// Run the script
if (require.main === module) {
  copyBlogAssets();
}

module.exports = { copyBlogAssets };