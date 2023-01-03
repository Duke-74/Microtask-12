FROM node:18

WORKDIR /usr/src/server2

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "index.js" ]
