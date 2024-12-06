# Step 1: Use a Node.js image
FROM node:20-alpine

# Step 2: Set the working directory
WORKDIR /usr/src/app

# Step 3: Copy backend code
COPY ./server ./server
COPY ./db ./db
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Expose the port (default for backend)
EXPOSE 5000

# Step 6: Run the server
CMD ["npm", "start"]

