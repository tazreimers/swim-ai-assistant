# Multi-stage build for NestJS API
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root files
COPY package.json package-lock.json pnpm-workspace.yaml tsconfig.base.json ./

# Copy apps and packages
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# Install dependencies
RUN npm ci --prefix packages/shared && npm ci --prefix apps/api

# Build shared package
WORKDIR /app/packages/shared
RUN npm run build

# Build NestJS API
WORKDIR /app/apps/api
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY --from=builder /app/package.json /app/package-lock.json ./

# Copy built application and dependencies
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start NestJS application
CMD ["node", "dist/main"]
