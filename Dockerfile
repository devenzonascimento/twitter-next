# Usando uma imagem menor e otimizada para produção
FROM node:22.11.0-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências necessárias
RUN apk add --no-cache curl

# Instalar PNPM globalmente
RUN npm install -g pnpm

# Copiar apenas arquivos essenciais primeiro para otimizar cache
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Instalar dependências sem salvar devDependencies
RUN pnpm install --frozen-lockfile --prod

# Gerar o cliente Prisma
RUN pnpm postinstall

# Copiar restante do código
COPY . .

# Construir a aplicação Next.js
RUN pnpm build

# Criar uma imagem final mais enxuta para rodar apenas a aplicação
FROM node:22.11.0-alpine

WORKDIR /app

# Copiar apenas os arquivos necessários da etapa de build
COPY --from=builder /app ./

RUN pnpm prisma migrate deploy --schema=./prisma/users-db.prisma

# Expor porta padrão do Next.js
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["pnpm", "start"]
