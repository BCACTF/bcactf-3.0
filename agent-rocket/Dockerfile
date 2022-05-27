FROM --platform=linux/amd64 node:16

# Copy package files
WORKDIR /usr/src/app
COPY server/package*.json ./server/

# Install dependencies
WORKDIR /usr/src/app/server
RUN npm ci

# Copy rest of files
WORKDIR /usr/src/app
COPY . .

# Run "npm build"
WORKDIR /usr/src/app/server
RUN npm run build --if-present

# Expose port and run server
EXPOSE 3000
CMD ["npm", "start"]