/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/': ['./public/skill-tree.html'],
  },
};

export default nextConfig;
