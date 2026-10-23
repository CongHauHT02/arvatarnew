# Dockerfile for Avatar Java Server & WebSocket Proxy
FROM eclipse-temurin:17-jdk-jammy AS base

# Install Node.js for WebSocket proxy
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy application files
COPY target/Avatar2D-1.0-SNAPSHOT.jar /app/server.jar
COPY config.properties /app/config.properties
COPY database.properties /app/database.properties
COPY res/ /app/res/
COPY ws-proxy.js /app/ws-proxy.js
COPY package.json /app/package.json

RUN npm install --production

# Expose ports: 19128 (TCP Game Server), 19129 (WebSocket Proxy)
EXPOSE 19128 19129

# Start script
CMD ["sh", "-c", "node ws-proxy.js & java -jar server.jar"]
