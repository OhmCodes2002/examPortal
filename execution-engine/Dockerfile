FROM node:20-alpine
WORKDIR /app

# Install dependencies if required for execution engine
COPY package*.json ./
RUN npm install || true

COPY . .

# Sandbox runner
CMD ["node", "engine.js"]
