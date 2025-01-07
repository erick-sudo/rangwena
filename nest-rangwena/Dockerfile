# BUILD STAGE
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN yarn prisma generate

# Build the application
RUN yarn build

# PRODUCTION STAGE
FROM node:18-alpine

# Set node environment to production
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy package files
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy Prisma schema and generated client
COPY prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

# Copy built application
COPY --from=builder /usr/src/app/dist ./dist
COPY wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh

EXPOSE 3000

CMD ["yarn", "run", "start:migrate:dev"]