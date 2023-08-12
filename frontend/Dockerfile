# Base on offical Node.js Alpine image
FROM node:alpine as build

# Set working directory
WORKDIR /usr/app

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./src/client/package*.json ./

# Copy all files
COPY ./src/client ./

ARG VITE_REACT_BACKEND_API_URL
ENV VITE_REACT_BACKEND_API_URL=$VITE_REACT_BACKEND_API_URL

RUN touch ./.env.local
RUN printenv > ./.env.local

# Install dependencies
RUN npm i

# Build app
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /usr/app/dist /usr/share/nginx/html
# new
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]