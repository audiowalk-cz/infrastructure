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

EXPOSE 80
ENV NODE_ENV=production

CMD ["npm", "start"]
