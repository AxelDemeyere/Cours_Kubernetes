FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY auth-app.js .
EXPOSE 80
CMD ["node", "auth-app.js"]

