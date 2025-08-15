# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

# Build-time env for Vite
ARG VITE_API_BASE
ENV VITE_API_BASE=${VITE_API_BASE}

# Guard: fail if missing; also create .env.production for Vite
RUN test -n "$VITE_API_BASE" || (echo "ERROR: VITE_API_BASE is empty" && exit 1)
RUN printf "VITE_API_BASE=%s\n" "$VITE_API_BASE" > .env.production

# Show what we are building with, then build in production mode
ENV NODE_ENV=production
RUN echo "VITE_API_BASE=${VITE_API_BASE}" && npm run build -- --mode production

# ---------- Serve stage ----------
FROM nginx:alpine
RUN printf 'server {\n\
  listen 8080;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location = /index.html { add_header Cache-Control "no-store"; try_files $uri =404; }\n\
  location / { try_files $uri $uri/ /index.html; }\n\
  location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; try_files $uri =404; }\n\
}\n' > /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx","-g","daemon off;"]
