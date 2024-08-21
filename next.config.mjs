/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
    images: {
        domains: [
          "lh3.googleusercontent.com",
          "www.google.com",
          "https://picsum.photos",
          "picsum.photos",
          "res.cloudinary.com",
          "localhost",
        ],
        remotePatterns: [
          {
            protocol: "http",
            hostname: "localhost",
            port: "3000",
            pathname: "/**",
          },
          {
            protocol: "https",
            hostname: "picsum.photos",
            port: "",
            pathname: "/**",
          },
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
            port: "",
            pathname: "/**",
          },
          {
            protocol: "https",
            hostname: "images.app.goo.gl",
            port: "",
            pathname: "/**",
          },
          {
            protocol: "https",
            hostname: "www.uhdpaper.com",
            port: "",
            pathname: "/**",
          },
          {
            protocol: "https",
            hostname: "m.media-amazon.com",
            port: "",
            pathname: "/**",
          },
        ],
      },
};

export default nextConfig;
