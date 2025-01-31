import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export const getBrowserData = async (headersList: ReadonlyHeaders) => {
  const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";

	// Obter User-Agent
	const userAgent = headersList.get("user-agent") ?? "Unknown User Agent";

	// Geolocalização (API externa)
	const geoData = await fetch(`https://ipapi.co/${ip}/json/`).then((res) =>
		res.ok ? res.json() : { city: "Unknown", country_name: "Unknown" },
	);

	const geoLocation = `${geoData.city}, ${geoData.country_name}`;

	return {
		ip,
		userAgent,
		geoLocation,
	};
}