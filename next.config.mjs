/** @type {import('next').NextConfig} */
// const nextConfig = {};

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        http: false,
        https: false,
        url: false,
      };
    }
    return config;
  },
};
export default nextConfig;
