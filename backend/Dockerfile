FROM node:22-alpine

ARG PORT

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE $PORT

CMD ["pnpm", "run", "dev"]
