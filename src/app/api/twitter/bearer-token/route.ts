import { type NextRequest, NextResponse } from "next/server";

type CachedToken = {
	token: string;
	expiresAt: number;
};

let cachedBearerToken: CachedToken | null = null;

export async function GET(req: NextRequest) {
	const mustUseCache = req.nextUrl.searchParams.get("cache") !== "false";
	const consumerKey = process.env.TWITTER_CONSUMER_KEY || "";
	const consumerSecret = process.env.TWITTER_CONSUMER_SECRET || "";

	if (!consumerKey || !consumerSecret) {
		return NextResponse.json(
			{ error: "Missing Twitter API credentials" },
			{ status: 500 },
		);
	}

	// Verifica se o token está no cache e ainda válido
	if (
		mustUseCache &&
		cachedBearerToken &&
		cachedBearerToken.expiresAt > Date.now()
	) {
		console.log("✅ Usando token do cache.");
		return NextResponse.json({ token: cachedBearerToken.token });
	}

	console.log("🔄 Obtendo novo token...");

	const encodedCredentials = Buffer.from(
		`${consumerKey}:${consumerSecret}`,
	).toString("base64");

	try {
		const response = await fetch("https://api.twitter.com/oauth2/token", {
			method: "POST",
			headers: {
				Authorization: `Basic ${encodedCredentials}`,
				"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
			},
			body: "grant_type=client_credentials",
		});

		const data = await response.json();

		if (!response.ok || !data.access_token) {
			console.error("❌ Erro ao obter token:", data);
			return NextResponse.json(
				{ error: "Failed to fetch bearer token" },
				{ status: 500 },
			);
		}

		// Armazena o token no cache por 1 hora
		const expiresIn = 3600 * 1000;
		cachedBearerToken = {
			token: data.access_token,
			expiresAt: Date.now() + expiresIn,
		};

		console.log("✅ Token armazenado no cache.");
		return NextResponse.json({ token: data.access_token });
	} catch (error) {
		console.error("❌ Erro ao buscar token Bearer:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
