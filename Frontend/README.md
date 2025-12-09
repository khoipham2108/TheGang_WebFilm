# Disney-Clone

This is a Vite + React project (converted to TypeScript). It uses TheMovieDB (TMDB) API for movie data.

Quick start

1. Install deps

```bash
npm install
```

2. Create a local env file (not committed)

Create `.env.local` with:

```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

3. Run dev server

```bash
npm run dev
```

Pushing to GitHub

- Make sure `.env.local` is in `.gitignore` (it is by default)
- Do not commit your API key. Use `.env.local.sample` as a template.
