import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getInputType, InputType } from "@/helpers/getInputType";
import type { User } from "@prisma/client";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { username, password } = body;

		if (!username || !password) {
			// Validação simples
			return NextResponse.json(
				{ error: "Identificador e senha são obrigatórios." },
				{ status: 400 },
			);
		}

		const inputType = getInputType(username);

		let user: User = {} as User;

		if (inputType === InputType.Username) {
			// Salvar no banco de dados
			user = await prisma.user.create({
				data: {
					username,
					password,
				},
			});
		} else if (inputType === InputType.Email || inputType === InputType.Phone) {
			user = await prisma.user.create({
				data: {
					emailOrPhone: username,
					password,
				},
			});
		}

		return NextResponse.json({ user }, { status: 201 });
	} catch (error) {
		// console.error("Erro ao salvar usuário:", error);
		return NextResponse.json(
			{ error: "Erro ao salvar usuário." },
			{ status: 500 },
		);
	}
}

export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const { userId, code } = body;

		// Validação simples
		if (!userId || !code) {
			return NextResponse.json(
				{ error: "userId e code são obrigatórios." },
				{ status: 400 },
			);
		}

		// Salvar no banco de dados
		const user = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				code,
			},
		});

		return NextResponse.json({ user }, { status: 201 });
	} catch (error) {
		// console.error("Erro ao salvar usuário:", error);
		return NextResponse.json(
			{ error: "Erro ao salvar usuário." },
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
		// Salvar no banco de dados
		const users = await prisma.user.findMany();

		return NextResponse.json(users || [], { status: 200 });
	} catch (error) {
		// console.error("Erro ao salvar usuário:", error);
		return NextResponse.json(
			{ error: "Erro ao salvar usuário." },
			{ status: 500 },
		);
	}
}
