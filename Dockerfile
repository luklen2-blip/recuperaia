FROM node:20-alpine
WORKDIR /usr/src/app

# Instalação e cópia do código
COPY package*.json ./
RUN npm ci --omit=dev || npm install --production

COPY . .

# Teste pré-inicialização obrigatório pelo Padrão de Engenharia
RUN node tests/run_all.js

ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
