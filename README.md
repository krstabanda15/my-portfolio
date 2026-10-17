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

All seven projects and their links are bundled in `defaultContent.projects` in `app.js`; no Supabase connection is used. To update projects for every visitor, edit those defaults and redeploy the static site.

Existing browser data is migrated once: profile edits are preserved and projects are replaced with the seven bundled entries. Later admin edits persist on this browser. The local passcode is a convenience lock, not server authentication.
