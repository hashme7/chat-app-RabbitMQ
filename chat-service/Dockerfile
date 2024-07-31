FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3001

ENV PORT=3001
ENV CONNECT_STRING=mongodb://localhost:27017/messages

CMD ["npm", "start"]