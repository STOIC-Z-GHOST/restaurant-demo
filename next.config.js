/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve AVIF to browsers that support it (typically 20-30% smaller than
    // WebP), falling back to WebP.
    formats: ["image/avif", "image/webp"],
    // Keep optimized images in the cache for a year. The default is 60 seconds,
    // which makes the server re-optimize the same photo over and over.
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
};

module.exports = nextConfig;
