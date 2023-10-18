# Wrapper

How to have a "wrapper" project to manage other projects using docker and
docker compose.

## Running with docker

First build your local image:

```
docker build -t node-wrapper ./docker
```

Copy `compose.yaml.sample` to `compose.yaml`:

```
cp compose.yaml.sample compose.yaml
```

Then install the dependencies:

```
docker-compose run --rm proj1 npm install
docker-compose run --rm proj2 npm install
docker-compose run --rm proj3 npm install
```

Start all the projects:

```
docker-compose up
```

Or you can start individual projects using:

```
docker-compose up projX
```

Where `X` is the project number.

## FAQ

### Why we need the extra `docker build` step?

If you use docker compose's built-in image/dockerfile management thing you will
end up with 3 different images built in the same way.

The only way, as far as I know, to have **only one** custom docker image (e. g., not
hosted on hub.docker.com) is to build it yourself first.

### Why my projects all listen to the port 3000?

The projects can all run in the same port and you can remap using docker's.

For this example:

* Proj1 listen to 3000 inside the container and docker routes 3000 to 3000
* Proj2 listen to 3000 inside the container and docker routes 3001 to 3000
* Proj3 listen to 3000 inside the container and docker routes 3002 to 3000

### Why don't you use nvm?

Node.js is the easier app to install ever.

In my opinion nvm is a good option when you have to switch very often.

If your project depends on a node version you know, you probably don't need
nvm.

If you are creating a docker image for production, it is an extra layer you can
avoid.

If you are using docker/docker compose, docker is your version manager 🤯.

### Why I still have `proj1/Dockerfile` and so on?

I left those `Dockerfile`s there just in case you want build each project for
production, in that case you install npm, copy the project to the container and
run `npm install`. See the project's `Dockerfile` for references.

### What if I need to update one npm package from one of the projecs?

If you need to update any npm dependencies of the projects run:

```
docker-compose run --rm projX npm install
```

If for some reason you have a problem with npm and you want to start fresh,
find the volume with `docker volume ls` and then remove that volume with
`docker volume rm volume-name-xxx`

### What if **only one** of my projects change the version of node?

Then you need to create another `Dockerfile` and update `compose.yaml`.

I would (1) copy `docker/Dockerfile` to `docker/Dockerfile.18.18.2`.

(2) Update the line that says the version, for example:

```
env NODE_VERSION=18.18.2
```

Then (3) update `compose.yaml`:

```
  projX:
    build:
      context: ./docker
      dockerfile: ./Dockerfile.18.18.2
    volumes:
      - ./projX:/app
      - node_modules18182:/app/node_modules
      - ./docker:/root
    working_dir: /app
    env_file: .env.shared
    ports:
      - 3002:3000
    command: npm start

volumes:
  node_modules:
  node_modules18182:
```

Where `X` is the number of the project. I don't think you need that extra
_volume_, but I would play safe and have it.

And, of course, (4) you need to install dependencies again, using:

```
docker-compose run --rm projX npm install
```

### I don't like this approach, I prefer to run one command, `docker-compose up`, and have everything set up

Your problem. Better to buy more harddrive.

You are going to end up with **several images** and each image will be too big
(because they now have `node_modules` inside the image) and every time you
rebuild the images the npm dependencies may be reinstalled from scratch.

If you need to have one command in development create this script:

```
#!/bin/sh

set -xe

docker build -t node-wrapper ./docker
docker-compose run --rm proj1 npm install
docker-compose run --rm proj2 npm install
docker-compose run --rm proj3 npm install
```

Call it `setup.sh`, run it every time you start in a new machine, and then use
`docker-compose` as usual.

But remember you only have to run `docker build -t node-wrapper ./docker` once.
And `docker-compose run --rm projX npm install` once OR every time you
add/update any npm dependencies of _that_ project.

### Why are you git-ignoring compose.yml?

There are a lot of people with strong opinions about docker. I believe it is
better to give those people a "starter pack" and then let them modify their
`compose.yml` as they please.

### Why you have a directory called root?

Just in case you need to customize files like `.npmrc` or anyting else.

### Why don't you have `EXPOSE 3000` in `Dockerfile`?

It is a matter of preference. I prefer not to have that information in
`compose.yml` instead.

### Why don't you have `CMD npm start` in `Dockerfile`?

Same as previous question.

### Why your `Dockerfile`s have commands in lower case? Are you sure it works?

Yes, it works. And the reason is that YOU DON'T NEED TO SCREAM. You can write
commands in upper or lower case inside `Dockerfile` or when writing SQL.
