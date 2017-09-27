FROM smebberson/alpine-nodejs:6.7.0

# Available at runtime.
ENV NODE_ENV="development"

# Add the package.json ready to build NPM modules.
COPY root/app/package-lock.json /app/
COPY root/app/package.json /app/

# Create .npmrc for NPM authorisation, build NPM modules and then remove the auth file.
RUN cd /app && \
    npm install --production

# Copy across the source for the app
COPY root /

# Expose the port
EXPOSE 80
