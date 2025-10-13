# ---------- Builder: Vite build ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dep dengan cache
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# Copy source
COPY . .

# Env build-time (Vite makan VITE_* saat build)
ARG VITE_API_BASE_URL
ARG VITE_SOCKET_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}

# Build
RUN npm run build

# ---------- Runtime: Nginx ----------
FROM nginx:1.27-alpine

# Pakai nginx.conf dari repo (SPA fallback, caching, gzip, dll)
# Pastikan file ini ada di repo: docker/nginx/nginx.conf
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# Hapus default site (opsional; kita pakai server block dari nginx.conf)
RUN rm -f /etc/nginx/conf.d/default.conf || true

# Salin hasil build
COPY --from=builder /app/dist /usr/share/nginx/html

# Healthcheck sederhana
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

EXPOSE 80
