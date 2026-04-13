/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/skill-tree.html' },
    ];
  },
};

export default nextConfig;
