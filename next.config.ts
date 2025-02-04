import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
	env: {
		TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
		TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
		BOT_TOKEN: process.env.BOT_TOKEN,
		GROUP_ID: process.env.GROUP_ID,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**", // Permite qualquer domínio
			},
		],
	},
	webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
};

export default nextConfig;
