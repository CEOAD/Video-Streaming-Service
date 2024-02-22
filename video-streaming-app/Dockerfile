# Step 1: Build the React application
FROM node:14 as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Step 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# Define the command to run your app using CMD which defines your runtime
CMD ["nginx", "-g", "daemon off;"]
