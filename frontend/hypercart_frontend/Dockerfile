FROM node:22.4.0-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

USER node

COPY --chown=node:node . .

RUN npm run build

FROM nginx:alpine 

COPY --from=builder /app/dist/hypercart_frontend/browser usr/share/nginx/html

EXPOSE 80

# CMD ["npx","ng","serve","--host","0.0.0.0","--port","4200","--poll","1000"]