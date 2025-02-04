# Etapa de build
FROM node:22.11.0-alpine AS builder

WORKDIR /app

# Instalar dependências essenciais
RUN apk add --no-cache curl

# Copiar package.json e package-lock.json para aproveitar cache do Docker
COPY package.json package-lock.json ./

# Instalar dependências sem devDependencies
RUN npm ci --omit=dev

# Copiar restante do código
COPY . .

# Gerar cliente Prisma (se necessário)
RUN npm run postinstall

# Build da aplicação Next.js
RUN npm run build

# Criar imagem final para rodar a aplicação
FROM node:22.11.0-alpine

WORKDIR /app

# Copiar arquivos da etapa de build
COPY --from=builder /app .

# Expor porta do Next.js
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
