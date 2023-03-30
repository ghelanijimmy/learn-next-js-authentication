/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  env: {
    mongodb_username: "ghelanijimmy",
    mongodb_password: "LearnNextJS",
    mongodb_clustername: "cluster0",
    mongodb_database: "auth",
    SECRET: "ThisIsASecret",
  },
};

module.exports = nextConfig;
