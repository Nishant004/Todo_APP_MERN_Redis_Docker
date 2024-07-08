FROM node:12 AS Production

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

RUN npm run build

CMD ["sh", "-c", "npm run start"]
