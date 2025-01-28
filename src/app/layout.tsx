import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "X",
};

export const viewport: Viewport = {
	colorScheme: "only light",
	themeColor: "#fff",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link
					href="https://abs.twimg.com/favicons/twitter.3.ico"
					rel="shortcut icon"
					type="image/x-icon"
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
