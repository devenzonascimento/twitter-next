import { type NextRequest, NextResponse } from "next/server";

export type TwitterUser = {
	id: string;
	name: string;
	username: string;
	profile_image_url: string;
};

type TwitterUserResponse = {
	data?: TwitterUser;
	errors?: Array<{ message: string }>;
};

// Estrutura para armazenar os usuários no cache
type CachedUser = {
	user: TwitterUser;
	expiresAt: number;
};

// Cache em memória
const userCache = new Map<string, CachedUser>();

export async function GET(req: NextRequest) {
	const username = req.nextUrl.searchParams.get("username");

	if (!username) {
		return NextResponse.json({ error: "Missing username parameter" }, { status: 400 });
	}

	// Verifica se o usuário está no cache e ainda válido
	const cachedUser = userCache.get(username);
	if (cachedUser && cachedUser.expiresAt > Date.now()) {
		// console.log(`✅ Usuário ${username} encontrado no cache.`);
		return NextResponse.json(cachedUser.user);
	}

	// console.log(`🔄 Buscando usuário ${username} na API do Twitter...`);

	try {
		// Obtém o Bearer Token dinamicamente do endpoint local
		const tokenUrl = `${req.nextUrl.origin}/api/twitter/bearer-token`;
		const tokenResponse = await fetch(tokenUrl);
    // console.log("")
    // console.log("tokenResponse", tokenResponse)
    // console.log("")
		const tokenData = await tokenResponse.json();

		if (!tokenResponse.ok || !tokenData.token) {
			// console.error("❌ Erro ao obter Bearer Token:", tokenData);
			return NextResponse.json({ error: "Failed to fetch Bearer Token" }, { status: 500 });
		}

		const bearerToken = tokenData.token;

		// Busca o usuário na API do Twitter
		const response = await fetch(
			`https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url`,
			{
				headers: {
					Authorization: `Bearer ${bearerToken}`,
				},
			},
		);

		const data: TwitterUserResponse = await response.json();

		if (!response.ok || !data.data) {
			// console.error(`❌ Erro ao buscar usuário ${username}:`, data.errors);
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Armazena no cache por 12 hora
		const expiresIn = 3600 * 1000 * 12;
		userCache.set(username, {
			user: data.data,
			expiresAt: Date.now() + expiresIn,
		});

		// console.log(`✅ Usuário ${username} armazenado no cache.`);
		return NextResponse.json(data.data);
	} catch (error) {
		// console.error("❌ Erro ao buscar usuário no Twitter:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
