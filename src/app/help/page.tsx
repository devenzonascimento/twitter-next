import { Footer } from "@/components/footer";
import { XIcon } from "@/components/icons/x";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Help Center",
	description:
		"Get instant answers to the most common questions and learn how to use X like a pro.",
};

export default function HelpCenterPage() {
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

				<div className="px-6 flex flex-col items-center bg-white">
					<div className="relative w-[270px]">
						<iframe
							title=" "
							src="https://twitframe.com/show?url=https%3A%2F%2Ftwitter.com%2Felonmusk%2Fstatus%2F20"
							className="w-full h-[100px] border-0 pointer-events-none overflow-hidden blur-sm"
						/>

						<Image
							src="/cadeado.png"
							alt="Imagem do Cadeado"
							className="absolute top-5 left-1/2 -translate-x-1/2 size-[100px]"
							width={100}
							height={100}
							priority
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
