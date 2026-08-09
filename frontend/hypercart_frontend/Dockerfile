FROM node:22.4.0-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

COPY --chown=node:node . .

USER node


### uncomment for production

# RUN npm run build

# FROM nginx:alpine 

# COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPY --from=builder /app/dist/hypercart_frontend/browser usr/share/nginx/html

# EXPOSE 80

### uncomment for production

EXPOSE 4200

CMD ["npx","ng","serve","--host","0.0.0.0","--port","4200","--poll","1000"]