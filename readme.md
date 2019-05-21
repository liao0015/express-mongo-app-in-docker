# A express/mongo app in docker

A simple project to experiment with docker

## Base image (1.0.0)

Base image includes only an 'express app' and 'mongodb'.  The application can be built run, and tested in the following ways.

### `docker-compose` version (recommended)

- require docker installation
- requrie Dockerfile
- requrie docker-compose.yml
- make sure you switch `dbRoute` from `dockercompose`!

```shell
# only for the very first time
docker-compose up -d

# re-build and run
docker-compose build
docker-compose up -d

# access through browser at port 80
192.168.99.100

# access the running express app container from host
docker exec -it express-app-container-foo /bin/sh
#access the running mongodb container from host
docker exec -it mongo-db-container-foo /bin/sh
# access mongodb collections from host
mongo 192.168.99.100:27017

# stop and remove containers
docker-compose down
```

features avilable

- persistent data
- for persistent database use `mongodump` & `mongorestore` with docker volume
- applicant binding to container (so that live updates available for node/express app)
- dedicated network

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

### Docker version (without volume)

There will be two separate docker containers: one for express app and another for monogodb.  We are manually building and running each docker container and link them together.

With multiple containers launched separately, they need to be part of the same `network` to be able to talk to each other.  Note: avoid using `--link` as the flag will be deprecated.

- require Dockerfile to build the 'express app' image
- 'mongodb' image will be pulled from docker hub repo
- you will need to run mongo container first, as the express app depends on it
- make sure update url to mongodb inside 'index.js'

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

### Docker version (volume included)

Without `volume`, everytime you make changes to your 'index.js', you will have to

- stop running container
- remove the stopped container
- `docker build` again
- `docker run` new container based on the update image

Note: you can chain the above commands `docker stop my-container && docker rm my-container && docker build -t new-image . && docker run -d -p 80:3000 --name my-container new-image`

With `volume`: you can either create a volume and mount to your container, or mount a subdirectory or your whole application to the container as a volume

Note: if you made changes to your Dockerfile, you will need to re-build the image

```shell
  # create a volume
  docker volume create my-volume
  # run a container and attach the created volume
  docker run -d -p 8000:3000 --name my-container --volume my-volume:/logs node-app
  # say you have a '/logs' dir in you appliation, and you want to mount it to your container
  docker run -d -p 8000:3000 --name my-container --volume $(pwd)/logs:/logs node-app
  # to mount the whole application in '/app' dir inside the container
  docker run -d -p 8000:3000 --name my-container --volume $(pwd):/app node-app
```

```shell
  # create a volume and run a mongo cotnainer by attaching the volume to its /var/lib/data
  docker volume create foo-mongo
  docker run -d --name foo-mongo --volume foo-mongo:/var/lib/data mongo
  # let's make a file in /var/lib/data
  docker exec -it foo-mongo /bin/bash
  touch /var/lib/data/file.txt
  echo "hello world" var/lib/data/file.txt

  # bring down the container
  docker stop foo-mongo
  docker rm foo-mongo

  # re-launch another container
  docker run -d --name foo-moon --volume foo-mongo:/var/lib/data mongo
  # check the file
  docker exec -it foo-moon /bin/bash
  cat /var/lib/data/file.txt

  # you will see "hello world"
  # the data persisted
```

Bonus: How to persist data in mongodb database

```shell
# say, we are in foo-moon as shown above
# mongodump will save all data in any dir you define
mongodump --out /var/lib/data/dump

# to restore the data from /dump dir
mongorestore /var/lib/data/dump

# now you have restored the data from /dump folder
```

More bonus:

- compress the dump `tar -cvzf dump.tar.gz /var/lib/data/dump`
- uncompress the tar file `tar -xvzf dump.tar.gz`
- download the dump `scp -r root@IP:/var/lib/data/dump ./backup`
- upload the dump `scp -r ./backup root@IP:/var/lib/data/dump`
