# Advanced To-Do (Local Storage)

Simple, modern, offline-first To-Do web app built with HTML, CSS, and vanilla JavaScript. Stores everything in Local Storage — no backend or services.

How to run

1. Open the `index.html` file in your browser (double-click or use `Open File...`).
2. Or serve with a static server for better local behavior:

```bash
# using Python 3
python -m http.server 5173
# then open http://localhost:5173/advanced-todo/
```

Features

- Add / edit / delete tasks
- Mark tasks complete
- Priority (Low / Medium / High)
- Categories (create custom)
- Search, filter (category/priority/status), sort
- Dark / Light mode (persistent)
- Progress bar
- Responsive design

Files

- `index.html` — main UI
- `src/styles.css` — styles
- `src/app.js` — application logic (Local Storage)

Notes

- Everything is stored in Local Storage in your browser. Clearing storage or using a different browser/device will not keep data.
- This is intentionally dependency-free and beginner-friendly.
