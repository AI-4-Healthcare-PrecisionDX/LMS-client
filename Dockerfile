# Production Dockerfile
FROM oven/bun:latest as builder

WORKDIR /app

# Copy package files
COPY package.json .
COPY bun.lockb .

# Install dependencies
RUN bun install

RUN bun i pdfjs-dist
RUN bun install @react-pdf-viewer/core@3.12.0

# Copy the rest of the application
COPY . .

# Build the application
RUN bun run build

# Production image
FROM oven/bun:latest

WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app/package.json .
COPY --from=builder /app/bun.lockb .
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js .

# Install only production dependencies
RUN bun install --production

# Expose the port your app runs on
EXPOSE 3001

# Start the production server
CMD ["bun", "start"]