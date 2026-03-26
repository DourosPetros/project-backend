FROM node:18

# Δημιουργία working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy όλο το project
COPY . .

# Port
EXPOSE 3000

# Start app
CMD ["npm", "start"]