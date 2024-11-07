# Frontend Dockerfile
FROM node:16

WORKDIR /app

COPY ./frontend /app

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]