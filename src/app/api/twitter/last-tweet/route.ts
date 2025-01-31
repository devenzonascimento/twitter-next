import { type NextRequest, NextResponse } from "next/server";

type Tweet = {
	text: string;
	id: string;
};

type TwitterTweetsResponse = {
	data?: Array<Tweet>;
	errors?: Array<{ message: string }>;
};

// Estrutura para armazenar os tweets no cache
type CachedTweet = {
	tweet: Tweet;
	expiresAt: number;
};

// Cache em memória
const tweetCache = new Map<string, CachedTweet>();

export async function GET(req: NextRequest) {
	const userId = req.nextUrl.searchParams.get("userId");

	if (!userId) {
		return NextResponse.json(
			{ error: "Missing userId parameter" },
			{ status: 400 },
		);
	}

	// Verifica se o último tweet do usuário está no cache e ainda válido
	const cachedTweet = tweetCache.get(userId);
	if (cachedTweet && cachedTweet.expiresAt > Date.now()) {
		// console.log(`✅ Último tweet do usuário ${userId} encontrado no cache.`);
		return NextResponse.json(cachedTweet.tweet);
	}

	// console.log(`🔄 Buscando último tweet do usuário ${userId} na API do Twitter...`);

	try {
		// Obtém o Bearer Token dinamicamente do endpoint local
		const tokenUrl = `${req.nextUrl.origin}/api/twitter/bearer-token`;
		const tokenResponse = await fetch(tokenUrl);
		const tokenData = await tokenResponse.json();

		if (!tokenResponse.ok || !tokenData.token) {
			// console.error("❌ Erro ao obter Bearer Token:", tokenData);
			return NextResponse.json(
				{ error: "Failed to fetch Bearer Token" },
				{ status: 500 },
			);
		}

		const bearerToken = tokenData.token;

		// Busca os tweets do usuário na API do Twitter
		const response = await fetch(
			`https://api.twitter.com/2/users/${userId}/tweets`,
			{
				headers: {
					Authorization: `Bearer ${bearerToken}`,
				},
			},
		);

		const data: TwitterTweetsResponse = await response.json();

		if (!response.ok || !data.data || data.data.length === 0) {
			// console.error(`❌ Erro ao buscar tweets do usuário ${userId}:`, data.errors);
			return NextResponse.json({ error: "No tweets found" }, { status: 404 });
		}

		// Pega o último tweet
		const lastTweet = data.data.at(-1);

		if (!lastTweet) {
			// console.log(`⚠️ Último tweet do usuário ${userId} não foi encontrado.`);
			return NextResponse.json(
				{ error: "No tweets available" },
				{ status: 404 },
			);
		}

		// Armazena no cache por 12 horas
		const expiresIn = 3600 * 1000 * 12;
		tweetCache.set(userId, {
			tweet: lastTweet,
			expiresAt: Date.now() + expiresIn,
		});

		// console.log(`✅ Último tweet do usuário ${userId} armazenado no cache.`);
		return NextResponse.json(lastTweet);
	} catch (error) {
		// console.error("❌ Erro ao buscar último tweet no Twitter:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
