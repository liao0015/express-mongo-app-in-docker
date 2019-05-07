FROM node:10

WORKDIR /app

# COPY package.json .

# RUN yarn install

# copy every thing from host to container /app
# including /node_modules
COPY . .

# or you exclude node_modules and install dependencies in the container
# make sure you set .dockerignore to include node_modules
# COPY package.json .
# RUN yarn install
# COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]