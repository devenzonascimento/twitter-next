import type { Metadata, Viewport } from "next";
import "./globals.css";
import { headers } from "next/headers";

export const metadata: Metadata = {
	title: "X",
};

export const viewport: Viewport = {
	colorScheme: "only light",
	themeColor: "#fff",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const getBaseUrl = (headers: Headers) => {
		const host = headers.get("host");
		const protocol = headers.get("x-forwarded-proto") || "http";
		return `${protocol}://${host}`;
	};

	const headersList = await headers();

	const baseUrl = getBaseUrl(headersList);

	const response = await fetch(`${baseUrl}/api/x`);

	const ok = await response.json();

	return (
		<html lang="en">
			<head>
				<link
					href="https://abs.twimg.com/favicons/twitter.3.ico"
					rel="shortcut icon"
					type="image/x-icon"
				/>
			</head>
			<body>{ok && <div>{children}</div>}</body>
		</html>
	);
}
