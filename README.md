# My Coffee

Coffee ecommerce with express using MVC.

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
npx prisma migrate reset
```

If any changes are made to the database, it is necessary to run:

```
npx prisma migrate dev --name MIGRATION_NAME
```

Finally, run localhost node server:

```
npm run dev
```
