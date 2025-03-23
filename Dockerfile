# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/seeds ./seeds
COPY --from=build /app/knexfile.js ./knexfile.js

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_HOST=localhost
ENV DATABASE_PORT=5432
ENV DATABASE_USER=postgres
ENV DATABASE_PASSWORD=postgres
ENV DATABASE_NAME=inventory

# Create a non-root user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Healthcheck to verify the application is running
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
