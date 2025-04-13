FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p src/migrations src/models src/seeders

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 