# ---------- Stage 1: Install dependencies ----------
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package manifests first for better layer caching
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# ---------- Stage 2: Production image ----------
FROM node:20-alpine

# Set a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy installed node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY package.json ./
COPY app.js ./
COPY public ./public

# Switch to non-root user
USER appuser

# Expose the port the app listens on (default 8080)
EXPOSE 8080

# Health-check using the /health endpoint defined in app.js
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

# Start the application
CMD ["node", "app.js"]
