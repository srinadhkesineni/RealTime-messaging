# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy everything into the container
COPY . .

# Install server dependencies
WORKDIR /app/server
RUN npm install

# Install client dependencies
WORKDIR /app/client
RUN npm install

# Default command: Run tests in both server and client
WORKDIR /app
CMD cd server && npm test
