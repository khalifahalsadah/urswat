# Step 1: Use a Node.js image to build the frontend
FROM node:20-alpine as build

# Step 2: Set working directory and copy code
WORKDIR /usr/src/app
COPY ./client ./

# Step 3: Install dependencies and build the frontend
RUN npm install
RUN npm run build

# Step 4: Use nginx to serve the built files
FROM nginx:alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 80 for the frontend
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

