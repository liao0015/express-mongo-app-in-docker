# A express/mongo app in docker

A simple project to experiment with docker

## level 2 image



## Base image (1.0.0)

Base image includes only an 'express app' and 'mongodb'.  The application can be built run, and tested in the following ways.

### Local version (without docker)

- requrie local installation of MongoDB
- require yarn/npm

```shell
# launch local database
mongod --dbpath "D:\mongodb\data"
# launch express server
yarn start
# visit web interface
localhost:3000
```

### Docker version

There will be two separate docker containers: one for express app and another for monogodb.  We are manually building and running each docker container and link them together.

With multiple containers launched separately, they need to be part of the same `network` to be able to talk to each other.  Note: avoid using `--link` as the flag will be deprecated.

- require Dockerfile to build the 'express app' image
- 'mongodb' image will be pulled from docker hub repo
- you will need to run mongo container first, as the express app depends on it

```shell
# create a network
$ docker network create --driver bridge foo-net

# build and run mongo container
docker run -dit --name foo-mongo-db --network foo-net mongo:latest

# build image and run express app container
docker build -t express-app:1.0.0 .
docker run -dit --name foo-express-app --network foo-net -p 80:3000 express-app:1.0.0

# naviagtion to localhost or $(docker-machine ip)
```

Bonus: interact with mongodb shell inside mongo running container

```shell
# access mongo database
docker exec -it foo-mongo-db /bin/bash
# enter mongo interactive shell
mongo
# check db list
show dbs
# switch db
use express-mongo
# check collections
show collections
# find all documents in the collection
db.items.find()
```

More bonus: access mongodb shell through host (instead of inside the container)

```shell
# you need to map port to host while running the container
docker run -dit --name foo-mongo-db --network foo-net -p 27017:27017 mongo:latest
# now you can access the mongo shell through host
mongo $(docker-machine ip):27017
# or
mongo 192.168.99.100:27017
```

## `docker-compose` version

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
