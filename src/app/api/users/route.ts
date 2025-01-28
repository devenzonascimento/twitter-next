import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { emailOrPhone, password } = body;

		// Validação simples
		if (!emailOrPhone || !password) {
			return NextResponse.json(
				{ error: "Email ou telefone e senha são obrigatórios." },
				{ status: 400 },
			);
		}

		// Salvar no banco de dados
		const user = await prisma.user.create({
			data: {
				emailOrPhone,
				password,
			},
		});

		return NextResponse.json({ user }, { status: 201 });
	} catch (error) {
		console.error("Erro ao salvar usuário:", error);
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
		console.error("Erro ao salvar usuário:", error);
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
		console.error("Erro ao salvar usuário:", error);
		return NextResponse.json(
			{ error: "Erro ao salvar usuário." },
			{ status: 500 },
		);
	}
}
