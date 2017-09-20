# lodestar ✫

A shining star that shows the way to a Codefresh on-demand test environment.

## Usage

Lodestar is a Docker container used to ease the pain with Codefresh on-demand test environments (OTE). It has the following specific goals:

- To ensure Codefresh OTEs can be run over known domains. This is important when you have multiple OTEs that must be used together (such as an app, and an SSO server).
- To ensure Codefresh OTEs can use SSL. Our entire pipeline is SSL, and so our OTEs should be too.

### How it works

Lodestar works by starting up in a Codefresh OTE, and using environment variables, automatically upserts a Route53 CNAME record pointing to the temporary domain.

Lodestar will report the domain which you can use in your browser to view the Codefresh OTE. You'll have to make note of the port in which the composition is running on however and append this to the URI.

### Configuring Lodestar

To configure Lodestar in a Codefresh OTE, add the following to a Codefresh composition:

```yml
lodestar:
    image: idearium/lodestar
    environment:
      - DOMAIN=lodestar.idearium.io
      - HOSTED_ZONE_ID=Z7O63FVGCNZNH
      - SERVICE=APP
```

Customise the following environment variables:

- `DOMAIN` should be the domain you want to update in Route53.
- `HOSTED_ZONE_ID` should be the Route53 hosted zone ID.
- `SERVICE` should be the name of the composition service exposing HTTP/HTTPS.

### Custom domains

By default, Lodestar uses the `DOMAIN` environment variable for Route53 configuration. However, if you'd like to specify a domain that is different from the default in the composition, simply set the `LAUNCH_DOMAIN` variable in the Codefresh Composition variables popup, to override the default.

## Development

The following documents how to get started developing the lodestar image.

### Dependencies

The following dependencies are required for development:

- [Docker](https://www.docker.com/community-edition) (> v17.06.2)
- [Node.js](https://github.com/creationix/nvm) (> v8.4.0)
- [infrastructure-common](https://github.com/idearium/infrastructure-common)

Please note: this has only been tested on MacOS environments.

### Directory structure

The following explains the various directories found within this repository:

- **app**: A simple Node.js application to launch on Codefresh.
- **devops**: Project specific customisations for the `c` cli.

### Getting started with development

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

The application should now be available at: https://lodestar.local. Review the Docker logs for the `lodestar` service and you'll see output showing it has updated Route53. You can also review the hosted zone in Route53 to make sure it updated.
