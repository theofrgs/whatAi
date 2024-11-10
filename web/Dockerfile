FROM node:18 AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM node:18 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
RUN npm run build

FROM node:18 AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/package.json ./package.json
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]
