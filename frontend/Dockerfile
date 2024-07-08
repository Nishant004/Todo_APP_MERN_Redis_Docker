FROM node:12 AS build


WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install


COPY . .


RUN npm run build


FROM node:18 AS production


WORKDIR /usr/src/app


COPY --from=build /usr/src/app/dist ./dist


RUN npm install -g serve


CMD ["serve", "-s", "dist", "-l", "5173"]
