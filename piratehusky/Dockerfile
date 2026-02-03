# Use Node.js official image
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining app files
COPY . .

# Build the app
RUN npm run build

# Remove dev dependencies for a lean runtime
RUN npm prune --omit=dev

ENV NODE_ENV=production

# Expose the API/static server port
EXPOSE 4173

# Start the API + static server
CMD ["npm", "run", "start"]
