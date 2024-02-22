# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any dependencies
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3003

# Define environment variable for Azure Storage Connection String
# Replace 'YourAzureStorageConnectionString' with your actual connection string
# or use Docker environment variable features or secrets management
ENV AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=acit3495;AccountKey=k1bXhDrGesqEwtMIcCWoknW2RwaMY7255ZwSM3JBZfaMLj3SGb5CgN9/PvwxEe23Qpf4EH8pu5L9+ASt/94TIQ==;EndpointSuffix=core.windows.net"

# Run the app when the container launches
CMD ["node", "server.js"]
