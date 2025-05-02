## Generating and Rolling Back Migrations (Development)

To generate a new migration:

```bash
npm run m:gen --name=<description>
```

Replace `<description>` with a name for the migration (e.g., `create_products_table`). This creates a file in `src/migrations/`.

To revert the last migration applied in development:

```bash
npm run m:reverse-dev
```

Both commands assume the development configuration in `typeorm.config.ts`. Make sure the `down()` function is correctly implemented in your migrations for rollback.
