/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['res.cloudinary.com', 'images.unsplash.com']
  },
  // Remove output: 'export' for development
  // output: 'export',
  // trailingSlash: true,
};

module.exports = nextConfig;