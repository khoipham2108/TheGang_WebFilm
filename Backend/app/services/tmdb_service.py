import asyncio
from typing import Any, Dict, Optional

import httpx
from fastapi import HTTPException

from ..config import get_settings


class TMDBClient:
    """HTTP client for TMDB using a shared AsyncClient and base URL."""

    def __init__(self, api_key: str, base_url: str = "https://api.themoviedb.org/3", timeout: float = 10.0):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self._timeout = timeout
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(base_url=self.base_url, timeout=self._timeout)
        return self._client

    async def _request(self, method: str, path: str, params: Dict[str, Any] | None = None) -> Dict[str, Any]:
        client = await self._get_client()
        params = params.copy() if params else {}
        # Prefer passing as query param to keep it simple and compatible with TMDB
        params.setdefault("api_key", self.api_key)

        try:
            resp = await client.request(method, path, params=params)
        except (httpx.ReadTimeout, httpx.ConnectTimeout) as e:
            raise HTTPException(status_code=504, detail=f"TMDB request timed out: {e}")
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Error connecting to TMDB: {e}")

        if resp.status_code != 200:
            # Try to extract TMDB error message
            try:
                payload = resp.json()
                message = payload.get("status_message") or payload.get("message") or resp.text
            except Exception:
                message = resp.text
            raise HTTPException(status_code=resp.status_code, detail=f"TMDB error: {message}")

        try:
            return resp.json()
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Invalid JSON from TMDB: {e}")

    async def get_popular_movies(self, page: int = 1) -> Dict[str, Any]:
        """Return popular movies page from TMDB."""
        return await self._request("GET", "/movie/popular", params={"page": page})

    async def get_top_rated_movies(self, page: int = 1) -> Dict[str, Any]:
        """Return top-rated movies page from TMDB."""
        return await self._request("GET", "/movie/top_rated", params={"page": page})

    async def get_movie_detail(self, movie_id: int) -> Dict[str, Any]:
        """Return movie details for a specific movie id."""
        return await self._request("GET", f"/movie/{movie_id}")

    async def search_movies(self, query: str, page: int = 1) -> Dict[str, Any]:
        """Search movies by keyword and return the results page."""
        return await self._request("GET", "/search/movie", params={"query": query, "page": page})

    async def get_movie_recommendations(self, movie_id: int, page: int = 1) -> Dict[str, Any]:
        """Return recommendations for a given movie id."""
        return await self._request("GET", f"/movie/{movie_id}/recommendations", params={"page": page})


# Provide a module-level client that loads settings lazily
_client_lock = asyncio.Lock()
_client_instance: Optional[TMDBClient] = None


async def get_tmdb_client() -> TMDBClient:
    """Lazily initialize and return a TMDBClient using environment settings."""
    global _client_instance
    if _client_instance is None:
        async with _client_lock:
            if _client_instance is None:
                settings = get_settings()
                _client_instance = TMDBClient(api_key=settings.TMDB_API_KEY, base_url=settings.TMDB_BASE_URL)
    return _client_instance


async def get_popular_movies(page: int = 1) -> Dict[str, Any]:
    """Fetch popular movies from TMDB and return raw TMDB JSON."""
    client = await get_tmdb_client()
    return await client.get_popular_movies(page=page)


async def get_top_rated_movies(page: int = 1) -> Dict[str, Any]:
    """Fetch top rated movies from TMDB and return raw TMDB JSON."""
    client = await get_tmdb_client()
    return await client.get_top_rated_movies(page=page)


async def get_movie_detail(movie_id: int) -> Dict[str, Any]:
    """Fetch a movie's full details by id from TMDB."""
    client = await get_tmdb_client()
    return await client.get_movie_detail(movie_id=movie_id)


async def search_movies(query: str, page: int = 1) -> Dict[str, Any]:
    """Search movies by query string and return TMDB response."""
    client = await get_tmdb_client()
    return await client.search_movies(query=query, page=page)


async def get_movie_recommendations(movie_id: int, page: int = 1) -> Dict[str, Any]:
    """Module-level helper to fetch movie recommendations."""
    client = await get_tmdb_client()
    return await client.get_movie_recommendations(movie_id=movie_id, page=page)
