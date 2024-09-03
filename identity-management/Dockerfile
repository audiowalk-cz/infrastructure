FROM node:20-alpine AS builder

WORKDIR /app

# INSTALL DEPENDENCIES
COPY ./package.json ./package-lock.json ./
RUN npm ci

# BUILD
COPY src src
COPY tsconfig.json nest-cli.json ./
RUN npm run build

RUN npm prune --omit=dev

EXPOSE 3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

CMD ["npm", "start"]
