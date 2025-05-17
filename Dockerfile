FROM node:22.12.0

RUN npm install -g @nestjs/cli

WORKDIR /api

COPY package.json package-lock.json ./

COPY . .
