# DataWeaver

**DataWeaver** is a headless CMS with advanced features and flexibility. It supports webhooks, user roles & governance, reusable schemas, and API integration for content delivery.

## Features:
- **Reusable Schemas**: Define content structures once and reuse them across multiple instances.
- **User Roles & Governance**: Manage access control with customizable roles and permissions.
- **API Support**: Fully API-driven for easy integration with frontend applications.
- **Webhooks**: Trigger real-time notifications and actions on content changes.

## Running locally
Run a local instance of PostgreSQL on port 5432 with database `dataweaver` and user `dataweaver` without authentication.

Create a .env.development file with a `JWT_SECRET` key.

```
npm i
npm run db:migrate:latest
npm run dev
```

## Deploying
```bash
docker compose up
```
