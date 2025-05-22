# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy both client and server package files
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install server dependencies
WORKDIR /app/server
RUN npm install

# Install and build client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Copy entire repo
WORKDIR /app
COPY . .

# Serve static client build with Express (assuming server does this)
# If not, you'll need to configure your server to serve the build
# For example, use: app.use(express.static('../client/build'))

# Expose port used by server
EXPOSE 3000

# Start the server
WORKDIR /app/server
CMD ["npm", "start"]
