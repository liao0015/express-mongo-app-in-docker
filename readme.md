# A express/mongo app in docker

A simple project to experiment with docker

## Test locally (without docker)

- requrie local installation of MongoDB
- yarn install

```shell
# launch local database
mongod --dbpath "D:\mongodb\data"
# launch express server
yarn start
# visit web interface
localhost:3000
```

## without docker-compose

```shell
# build and run mongo container frist

# build and run express app container

```

## with docker-compose

- require docker installation
- requrie Dockerfile
- requrie docker-compose.yml
- make sure you switch `dbRoute` from local to docker!

```shell
# only for the very first time
docker-compose up -d

# re-build and run
docker-compose build
docker-compose up -d

# access through browser at port 80
192.168.99.100

# access the running express app container from host
docker exec -it express-mongo-app /bin/sh
#access the running mongodb container from host
docker exec -it mymongo-db /bin/sh
# access mongodb collections from host
mongo 192.168.99.100:27017
```
