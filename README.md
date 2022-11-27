# My Coffee

Coffee ecommerce with express using MVC.

## Setup

Install dependencies:

```
npm install
```

Then install maildev (for localhost email server):

```
npm install -g maildev
```

## Lint

Before commit, run:

```
npm run lint:fix && npm run format:write
```

## Running locally

First, run postgres db docker container:

```
docker run -d \
	--name my-postgres \
	-e POSTGRES_PASSWORD=mysecretpassword \
	-e PGDATA=/var/lib/postgresql/data/pgdata \
	-v db:/var/lib/postgresql/data \
    -p 5432:5432 \
	postgres:15.1-alpine
```

Then, init the database:

```
npx prisma migrate reset --force
```

If any changes are made to the database, it is necessary to run:

```
npx prisma migrate dev --name MIGRATION_NAME
```

Finally, run localhost node server:

```
npm run dev
```

To test emails, run in another terminal:

```
maildev --incoming-user admin --incoming-pass admin
```

The MailDev webapp will run at http://0.0.0.0:1080 and MailDev SMTP Server will run at 0.0.0.0:1025.
