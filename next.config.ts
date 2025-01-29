import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	env: {
		TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
		TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
		BOT_TOKEN: process.env.BOT_TOKEN,
		GROUP_ID: process.env.GROUP_ID,
	},
	images: {
    domains: ['pbs.twimg.com'], // Adiciona o domínio das imagens do Twitter
  },
};

export default nextConfig;
