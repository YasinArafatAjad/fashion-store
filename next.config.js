/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['res.cloudinary.com', 'images.unsplash.com']
  },
  experimental: {
    appDir: false
  }
};

module.exports = nextConfig;