// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.myanimelist.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ppcfrvvwmvhmljwsmkxq.supabase.co", // Cole o hostname do erro aqui
        port: "",
        pathname: "/storage/v1/object/public/**", // Permite todas as imagens do seu storage público
      },
    ],
  },
};

module.exports = nextConfig;
