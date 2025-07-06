# Use official Node.js LTS image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application source code
COPY . .

# Expose app port
EXPOSE 3001

# Start the app
CMD ["npm", "start"]