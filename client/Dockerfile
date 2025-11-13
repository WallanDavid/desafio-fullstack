FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json vite.config.ts index.html ./
COPY src ./src
ARG VITE_API_URL=http://server:4000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm install && npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
