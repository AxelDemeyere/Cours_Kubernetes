FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY users-app.js .
EXPOSE 8080
CMD ["node", "users-app.js"]

