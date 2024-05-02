FROM node:18-alpine AS build
WORKDIR /opt/app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS run
WORKDIR /opt/app
COPY --from=build /opt/app ./
COPY . ./
EXPOSE 3000
CMD ["node", "app", "3000"]
