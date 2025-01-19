# Этап сборки (build stage)
FROM node:18-alpine as builder

ARG VITE_HOST_URL

ENV VITE_HOST_URL=$VITE_HOST_URL

# Установка pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Копирование файлов package.json и pnpm-lock.yaml
COPY package*.json pnpm-lock.yaml ./

# Установка зависимостей
RUN pnpm install --frozen-lockfile

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN pnpm run build

# Этап production (production stage)
FROM nginx:alpine

# Копирование конфигурации nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копирование собранного приложения из этапа сборки
COPY --from=builder /app/dist /usr/share/nginx/html

# Проверка конфигурации nginx
RUN nginx -t

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
