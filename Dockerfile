FROM node:20-alpine3.20 as builder

WORKDIR /app
COPY package.json .
RUN npm install
RUN npm install expo
RUN npm install nativewind
RUN npm install --save-dev tailwindcss@3.3.3

COPY . .

CMD ["npx", "expo", "start", "-c"]


