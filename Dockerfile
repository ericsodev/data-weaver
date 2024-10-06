FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm i
RUN npm run build

CMD ["node", "-r", "dotenv/config", "--env-file=.env.production", "build"]
