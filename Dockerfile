# ── Stage 1: build ───────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Pass a GitHub token to raise the API rate limit (optional but recommended)
ARG GITHUB_TOKEN

COPY package*.json ./
RUN npm ci

COPY . .

# Build: fetch GitHub repos + parse profile.md + ORCID + Vite
RUN npm run build

# ── Stage 2: serve with nginx ─────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
