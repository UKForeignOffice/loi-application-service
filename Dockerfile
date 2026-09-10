FROM node:24-alpine AS build
WORKDIR /opt/app
COPY package*.json ./
RUN npm ci --omit=dev \
  && rm -rf /opt/app/node_modules/machinepack-redis/node_modules/redis/heroku

FROM node:24-alpine AS run
WORKDIR /opt/app
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
COPY --chown=node:node --from=build /opt/app/node_modules ./node_modules
COPY --chown=node:node --from=build /opt/app/package.json ./package.json
COPY --chown=node:node . ./
RUN find /opt/app -type f \( \
  -name "package-lock.json" -o \
  -name "Gemfile.lock" -o \
  -name "npm-shrinkwrap.json" -o \
  -name "yarn.lock" -o \
  -name "pnpm-lock.yaml" \
\) -delete
EXPOSE 3000
USER node
CMD ["node", "app", "3000"]
