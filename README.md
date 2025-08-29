# TrackLab

<img src="apps/tracklab/public/favicon.ico" width="50">

## Requirements

- Node: ~22.19.0 (Current LTS)
- pnpm: ~10.14.0
- Python: ~3.9
- uv: ~0.7.3
- Docker / Docker Compose (development only)

## Environment Configuration

For the application to work, you need to create a file called `.env` in the root directory.
The following variables MUST be defined:

- DATABASE_URL
  - The API will use this URL to connect to the database.
  - The URL should be formatted according to Prisma specifications.
  - https://www.prisma.io/docs/orm/reference/connection-urls
- JWT_SECRET
  - This serves as your JWT encryption key.
  - Make sure this key is long enough and not guessable. (using something like 'secret' is not a good idea)
- S3_ENDPOINT
  - The endpoint of your S3 instance
- S3_REGION
  - Region of your S3 instance
- S3_ACCESS_KEY
  - Access key to your S3 instance
- S3_SECRET_KEY
  - the secret key to your S3 instance
- PRODUCTION
  - Determines if we use SSL/TLS for the database connection.
  - Only important if the demo data should be loaded

In case you want to use the provided Docker file for just trying it out, the following variables must be defined as well:

- POSTGRES_HOST
  - This is the hostname of the database server (e.g. localhost)
- POSTGRES_USER
  - This is the username for the Postgres Database
- POSTGRES_PASSWORD
  - The password for the user defined above
- POSTGRES_DB
  - The name of the database

**Important**

If another database provider than Postgres is used, this needs to be changed in the `schema.prisma`, which can be found in `apps/tracklab-api/prisma`.
Change the `provider` property of the `datasource` object to the appropriate provider.

A sample `.env` file for the provided development setup could look like this:

``` dotenv
# Database provider:  postgresql
# Database user:      tracklab
# Database passowrd:  tracklab123!
# Database host:      localhost
# Database port:      5432
# Databse name:       tracklab
# Schema:             public
DATABASE_URL="postgresql://tracklab:tracklab123!@localhost:5432/tracklab?schema=public"

POSTGRES_HOST=localhost
POSTGRES_USER=tracklab
POSTGRES_PASSWORD=tracklab123!
POSTGRES_DB=tracklab

JWT_SECRET=<GENERATE-SOME-JWT-SECRET>

S3_ENDPOINT=http://localhost:9000
S3_REGION=eu-central-1
S3_ACCESS_KEY=admin
S3_SECRET_KEY=admin123

PRODUCTION=false
```

## Development Setup

To have a good development experience use the docker-compose file to set up a temporary database:

```sh
docker compose up
```

### Run tasks

Now we need to start the development-servers for both UI, API and data-service project:

```sh
npx nx serve tracklab-ui
```

```sh
npx nx serve tracklab-api
```

```sh
npx nx serve fast_f1_service
```

### Development Database

A pre-build script for the API will populate the database with some sample data.
There will be 1 user for development out of the box:

- admin@tracklab.com
  - pw: admin

## Deployment

To deploy TrackLab to a server use the following commands in the root directory of the repository.

```sh
npm install
```

```sh
npm build:production
```

After these two commands, you can find the built project in the `dist` folder on the root level of the repository.
To launch TrackLab, simply start the Node.js server using:

```sh
node ./dist/apps/tracklab-api/main.js
```

Optionally, demo data can be generated in the database. This wipes the database clean, so be careful and use backups before doing that.

```sh
npm generate-demo-data
```

### Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
