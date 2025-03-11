# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код проекта
COPY . .

# Собираем Next.js приложение
RUN npm run build

# Экспортируем переменные окружения
ENV NODE_ENV=production

# Открываем порт 3000
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]