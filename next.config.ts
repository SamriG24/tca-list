/** @type {import('next').NextConfig} */
const nextConfig = { // required for static export
  images: {
    unoptimized: true, // disable server-side image optimization
    remotePatterns: [
      { protocol: 'https', hostname: 'tca.kaba.et' },
    ],
  },
};

module.exports = nextConfig;
