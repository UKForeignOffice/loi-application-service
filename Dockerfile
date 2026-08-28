FROM node:24-alpine AS build
WORKDIR /opt/app
COPY package*.json ./
RUN npm ci --omit=dev
RUN find /opt/app/node_modules -type f -name 'Gemfile.lock' -delete

FROM node:24-alpine AS run
WORKDIR /opt/app
COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/package.json ./package.json
COPY . ./
RUN rm -f package-lock.json
EXPOSE 3000
CMD ["node", "app", "3000"]
