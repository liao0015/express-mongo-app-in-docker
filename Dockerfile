FROM node:10

WORKDIR /app

ENV PORT=3000

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

EXPOSE ${PORT}

CMD [ "yarn", "start" ]