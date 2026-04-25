FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY src ./src

RUN npm install

EXPOSE 3005
CMD ["node", "src/index.js"]
