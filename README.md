# lodestar ✫

A shining star that shows the way to a Codefresh on-demand test environment.

## Dependencies

The following dependencies are required for development:

- [Docker](https://www.docker.com/community-edition) (> v17.06.2)
- [Node.js](https://github.com/creationix/nvm) (> v8.4.0)
- [infrastructure-common](https://github.com/idearium/infrastructure-common)

Please note: this has only been tested on MacOS environments.

## Directory structure

The following explains the various directories found within this repository:

- **app**: A simple Node.js application to launch on Codefresh.
- **devops**: Project specific customisations for the `c` cli.

## Development

Before beginning with development, make sure you have installed all the dependencies.

To begin with development, run the following:

```shell
# Log into NPM and follow the prompts.
$ npm login
# Log into Docker and follow the prompts.
$ docker login

# Setup the project.
$ npm install

# Setup Docker.
$ npm run-script docker

# Start the containers and log the output.
$ npm start
```

The application should now be available at: https://lodestar.local
