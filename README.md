

## Environment Variables

### apps/web
Скопируйте файл `apps/web/example.env` в `apps/web/.env` и заполните переменные.

### packages/database
Скопируйте файл `packages/database/example.env` в `packages/database/.env` и заполните переменные.

### packages/mailer
Скопируйте файл `packages/mailer/example.env` в `packages/mailer/.env` и заполните переменные.

## Database Migrations

Для применения миграций к базе данных перейдите в директорию `packages/database` и выполните команду:

```bash
pnpm push
```

Эта команда применит все миграции к вашей базе данных.
