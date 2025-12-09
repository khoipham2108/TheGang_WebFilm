Requirements

- Python 3.10 or newer
- A TMDB API key (v3) — set in `.env` as `TMDB_API_KEY`

Quick setup

1. From the `Backend` folder create and activate virtual env and install deps:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Create `.env` (copy `.env.example`) and set your key:

```powershell
copy .env.example .env
# then edit .env and set TMDB_API_KEY=your_real_key
```

3. Run locally:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Main API endpoints

- GET `/api/movies/popular` — popular movies
- GET `/api/movies/top_rated` — top rated movies
- GET `/api/movies/{movie_id}` — movie details
- GET `/api/movies/search?q=keyword` — search movies

API docs

- OpenAPI UI (Swagger): `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

Environment variables

- `TMDB_API_KEY` (required) — TMDB v3 API key
- `TMDB_BASE_URL` (optional) — default `https://api.themoviedb.org/3`
- `TMDB_IMAGE_BASE_URL` (optional) — default `https://image.tmdb.org/t/p/w500`
- `FRONTEND_ORIGIN` (optional) — default `http://localhost:3000`
- `APP_PORT` (optional) — port for uvicorn if you prefer (default shown when running uvicorn)

Notes

- CORS is configured to allow your frontend origin and common headers/methods.
- The backend uses an async `httpx.AsyncClient` with a shared base URL and timeouts.
