# Use the official Node.js 14 image as a base
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Expose the port your app runs on
EXPOSE 3002

# Command to run your app
CMD [ "node", "server.js" ]