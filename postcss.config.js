module.exports = {
  plugins: {
    // Add vendor prefixes but preserve modern CSS
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace'
    },
    // Don't use postcss-preset-env to avoid backdrop-filter warnings
    // Just keep the CSS as-is and let browsers handle it
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          // Don't remove vendor prefixes
          autoprefixer: false,
          // Don't remove duplicate rules (might be fallbacks)
          discardDuplicates: false,
          // Don't remove "unused" properties like backdrop-filter
          discardUnused: false,
          // Keep CSS custom properties
          reduceIdents: false,
          // Don't merge rules that might break specificity
          mergeRules: false,
          // Don't remove comments that might be important for @supports
          discardComments: {
            removeAll: false
          }
        }]
      }
    })
  }
}