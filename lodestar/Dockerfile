FROM smebberson/alpine-nodejs:6.7.0

# Available at runtime.
ENV NODE_ENV="development"

WORKDIR /app

# Add the package.json ready to build NPM modules.
COPY root/app/package-lock.json ./
COPY root/app/package.json ./

# Create .npmrc for NPM authorisation, build NPM modules and then remove the auth file.
RUN npm install --production

# Copy across the source for the app
COPY root /

CMD ["node", "server.js"]
