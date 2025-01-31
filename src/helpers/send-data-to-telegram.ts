const telegramApiUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

export const sendMessageToTelegramBot = async ({
	message,
}: { message: string }) => {
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
