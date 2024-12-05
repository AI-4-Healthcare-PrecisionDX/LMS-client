# syntax=docker.io/docker/dockerfile:1

# Base stage with Bun and Node
FROM oven/bun:latest AS base
# Update to use a more recent Node.js version
RUN apt-get update && apt-get install -y curl && \
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
  apt-get install -y nodejs npm

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy only the package files needed for installation
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy all node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/bun.lockb ./bun.lockb

# Copy necessary project files
COPY app ./app
COPY components ./components
COPY config ./config
COPY constant ./constant
COPY data ./data
COPY hooks ./hooks
COPY lib ./lib
COPY provider ./provider
COPY public ./public
COPY schema ./schema
COPY store ./store
COPY types ./types
COPY next.config.mjs ./
COPY postcss.config.mjs ./
COPY next-env.d.ts ./
COPY tsconfig.json ./
COPY .env* ./

# Build the application
RUN bun run build

# Production runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create nextjs user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public files
COPY --from=builder /app/public ./public

# Copy standalone output and static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to nextjs user
USER nextjs

# Expose and set port
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use bun to run the server
CMD ["bun", "server.js"]