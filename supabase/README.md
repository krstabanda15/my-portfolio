# Supabase Setup

This folder contains the database setup for the portfolio admin editor.

## Files

- `schema.sql` creates the `portfolio_content` table and row-level security policies.

## Before running

Replace this placeholder in `schema.sql`:

```sql
REPLACE_WITH_YOUR_AUTH_USER_ID
```

Use your Supabase Auth user ID. You can find it in:

Supabase Dashboard -> Authentication -> Users -> your user -> User UID

## App config

The Supabase project URL is already set in `app.js`:

```js
url: "https://ufcchadmnsgzmpzrvjpd.supabase.co"
```

You still need to add your `anon public` key in `app.js`.
