#Sample Dockerfile for NodeJS Apps

FROM node:16

ENV NODE_ENV=production

WORKDIR /

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 7000

CMD [ "node", "app.js" ]
