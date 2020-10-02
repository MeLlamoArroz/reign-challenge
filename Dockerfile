FROM node:latest

WORKDIR /reign-challenge

COPY package.json package.json

RUN npm install

COPY . .

EXPOSE 3000

RUN npm install -g nodemon

CMD [ "nodemon", "server/index.js" ]
