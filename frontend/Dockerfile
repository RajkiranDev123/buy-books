# Use Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependency files : COPY <source> <destination> : Copy files from your computer → into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of frontend code
COPY . .

# Next.js runs on port 3000
EXPOSE 3000

# Run Next.js development server
CMD ["npm", "run", "dev"]