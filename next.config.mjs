/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "homepressurecooking.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      ...["tse1", "tse2", "tse3", "tse4"].map((host) => ({ protocol: "https", hostname: `${host}.mm.bing.net` })),
      { protocol: "https", hostname: "www.chefspencil.com" },
    ],
  },
};

export default nextConfig;
