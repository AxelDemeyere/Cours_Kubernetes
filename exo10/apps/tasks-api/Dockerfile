FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY tasks-app.js .
EXPOSE 8000
CMD ["node", "tasks-app.js"]

