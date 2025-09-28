# 🚀 Supabase Local Development & Deployment Workflow

This guide details the essential steps for setting up, running, and syncing your Supabase project locally using the CLI, treating your cloud instance as your production environment.

## 📦 0. Install Dependencies
```bash
npm install
```
note: make sure youre in the database folder in order to install the dependencies
make sure youre using the correct node version
v18.17.1

## 🛠️ 1. Prerequisites & Initial Setup

Before you start, ensure you have the necessary tools installed and configured.

| Requirement | Details |
| :--- | :--- |
| **Node.js** | Required for `npm` and `npx`. |
| **Docker Desktop** | Required for running the local Supabase services (Postgres, Auth, etc.). |

### Setup Steps

1.  **Enable Docker TCP Sockets**
    * Go to **Docker Desktop General Settings**.
    * Ensure the option to **Expose daemon on tcp://localhost:2375 without TLS** (or similar wording) is enabled.
2.  **Install the Supabase CLI**
    ```bash
    npm install supabase --save-dev
    note: make sure youre in the database folder in order to install the dependencies
    ```
3.  **Initialize Your Project**
    * Navigate to your project directory (e.g., a dedicated `database` folder).
    ```bash
    npx supabase init
    ```
    * *This creates the necessary `supabase` folder where your configurations and migration files will live.*

---

## 🔗 2. Run, Authenticate, and Link

These commands bring your local services online and connect your local project to its remote counterpart.

| Action | Command | Purpose |
| :--- | :--- | :--- |
| **Start Local Services** | `npx supabase start` | Pulls the required Docker images and starts your local Supabase stack. |
| **Authenticate** | `npx supabase login` | Connects your local CLI session to your Supabase account via a browser sign-in. |
| **Link Project** | `npx supabase link --project-ref <project-id>` | Connects your local project setup to your remote cloud instance using its unique ID. |

---

## 💾 3. Database Migration Workflow

This is the core loop for schema development. You define changes locally, apply them, and maintain sync.

### Making Local Changes

1.  **Create a New Migration File**
    * This is where you write your SQL (e.g., `CREATE TABLE`, `ALTER TABLE`).
    ```bash
    npx supabase migration new <migration-name>
    ```
2.  **Apply & Sync All Migrations**
    * **This is your local update command.** It recreates your local database and runs *all* migration files, guaranteeing your local schema is perfectly in sync with your definition.
    ```bash
    npx supabase db reset
    ```

### Handling Remote Changes

1.  **Pull Remote Schema**
    * Use this if schema changes were made *directly* on the cloud console and you need them locally. It creates a new migration file reflecting those changes.
    ```bash
    npx supabase db pull
    ```
2.  **Apply New Migrations**
    * Applies any new, unapplied migration files to your local database.
    ```bash
    npx supabase migration up
    ```

---

## ☁️ 4. Deploying to Production (Cloud)

Before deploying, always check what you're about to push.

1.  **View Differences (Diffing)**
    * Crucial step! See the exact SQL changes between your local migrations and your cloud database schema.
    ```bash
    npx supabase diff
    ```
2.  **Push to Cloud**
    * Deploys your finalized schema changes by applying the new migration files to your linked cloud project.
    ```bash
    npx supabase db push
    ```

---