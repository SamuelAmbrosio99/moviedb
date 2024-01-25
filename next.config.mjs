/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['media.themoviedb.org'],
  },
  env: {
    REACT_APP_API_KEY: process.env.REACT_APP_API_KEY,
  },
};

export default nextConfig;
