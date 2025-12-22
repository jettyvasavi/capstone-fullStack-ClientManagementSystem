# Stage 1: Build Angular
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/corp-banking-cms/browser /usr/share/nginx/html
# Copy custom nginx config to handle routing (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
