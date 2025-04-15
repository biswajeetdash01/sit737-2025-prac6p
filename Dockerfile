FROM node:18-alpine

WORKDIR /usr/src/app

# First copy package files
COPY package*.json ./

# Install ALL dependencies (including winston)
RUN npm install

# Create logs directory
RUN mkdir -p ./logs

# Then copy the rest of the files
COPY . .

EXPOSE 3000

CMD ["node", "app.js"]