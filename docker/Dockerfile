# syntax=docker/dockerfile:1.7
# ---------- 1. Dependencies ----------
FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ---------- 2. Build ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- 3. Runtime (with LibreOffice for DOCX→PDF) ----------
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    SOFFICE_BIN=soffice

# LibreOffice + a minimal font set so docs render correctly.
# `fonts-liberation` covers Arial/Times/Courier metrics; `fonts-dejavu` covers
# common Latin/Cyrillic text. Add more (e.g. fonts-noto-cjk) as needed.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      libreoffice \
      libreoffice-writer \
      fonts-liberation \
      fonts-dejavu \
      ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Non-root user for safety.
RUN groupadd --system --gid 1001 nodejs \
 && useradd  --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000

CMD ["npm", "run", "start"]
