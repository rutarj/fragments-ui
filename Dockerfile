# Stage 1: Build Stage
FROM node:20.11.0 AS build

LABEL maintainer="Rutarj Shah <rshah103@myseneca.ca>"
LABEL description="Fragments Microservice"

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --only=production

# Stage 2: Production Stage
FROM node:20.11.0-slim

ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY --from=build /app .
#Assignment 2 

RUN npm ci --production

COPY ./src ./src


CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80
