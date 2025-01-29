import type { NextConfig } from "next";

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
};

export default nextConfig;
