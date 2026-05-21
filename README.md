# Portfolio Website

This is a static animated Bootstrap programmer portfolio with a private editor.

## Open it

Open `index.html` in a browser. The design uses Bootstrap from a CDN, so keep internet access on when previewing it locally.

## Admin editor

Go to `index.html#admin`.

Default passcode:

```text
change-me-2026
```

Change `ADMIN_PASSCODE` in `app.js` before publishing.

The editor saves to this browser's `localStorage` by default. That means it updates the public view on the same browser immediately.

For real public updates across all visitors, create the Supabase table using `supabase/schema.sql`, add your Supabase anon key in `app.js`, then sign in through `#admin` using your Supabase Auth email and password.
