# Use official Node.js image
FROM node:18

# Create working directory inside container
WORKDIR /app

# Copy package.json first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of backend code
COPY . .

# Tell Docker this container uses port 5000
EXPOSE 5000

# Start backend in development mode
CMD ["npm", "run", "dev"]