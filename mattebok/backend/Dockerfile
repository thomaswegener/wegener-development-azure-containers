# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy source files
COPY . .

# Install dependencies (uses your actual package.json if present)
RUN npm install

# Expose backend port
EXPOSE 3001

# Start backend
CMD ["node", "server.js"]
