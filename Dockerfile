FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm ci
RUN npm run build
RUN npm prune --omit=dev

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# K8s CronJob에서 args로 서브커맨드 전달
#   args: ["cleanup"] / ["auto-complete-cooking"] / ["auto-complete-delivery"]
ENTRYPOINT ["node", "dist/index.js"]
