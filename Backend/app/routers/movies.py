from fastapi import APIRouter, Query
from typing import List

from ..services.tmdb_service import (
    get_popular_movies,
    get_top_rated_movies,
    get_movie_detail,
    search_movies,
    get_movie_recommendations,
)
from app.routers import preferences as preferences_router
from ..schemas.movie import Movie, MovieList
from ..config import get_settings

router = APIRouter()


def _map_movie(raw: dict) -> dict:
    settings = get_settings()
    poster_path = raw.get("poster_path")
    poster_url = f"{settings.TMDB_IMAGE_BASE_URL}{poster_path}" if poster_path else None
    return {
        "id": raw.get("id"),
        "title": raw.get("title") or raw.get("name"),
        "overview": raw.get("overview"),
        "poster_path": poster_path,
        "poster_url": poster_url,
        "release_date": raw.get("release_date") or raw.get("first_air_date"),
        "vote_average": raw.get("vote_average"),
    }


@router.get("/popular", response_model=MovieList)
async def popular(page: int = Query(1, ge=1)):
    data = await get_popular_movies(page=page)
    mapped = {
        "page": data.get("page", 1),
        "results": [_map_movie(m) for m in data.get("results", [])],
        "total_pages": data.get("total_pages", 0),
        "total_results": data.get("total_results", 0),
    }
    return mapped


@router.get("/top_rated", response_model=MovieList)
async def top_rated(page: int = Query(1, ge=1)):
    data = await get_top_rated_movies(page=page)
    mapped = {
        "page": data.get("page", 1),
        "results": [_map_movie(m) for m in data.get("results", [])],
        "total_pages": data.get("total_pages", 0),
        "total_results": data.get("total_results", 0),
    }
    return mapped


@router.get("/search", response_model=MovieList)
async def search(q: str = Query(..., min_length=1), page: int = Query(1, ge=1)):
    data = await search_movies(query=q, page=page)
    mapped = {
        "page": data.get("page", 1),
        "results": [_map_movie(m) for m in data.get("results", [])],
        "total_pages": data.get("total_pages", 0),
        "total_results": data.get("total_results", 0),
    }
    return mapped


@router.get("/user/{user_id}/recommendations", response_model=MovieList)
async def user_recommendations(user_id: int, page: int = Query(1, ge=1)):

    favs = getattr(preferences_router, "_favorites", {})
    user_favs = list(favs.get(user_id, set()))
    if not user_favs:
        return {"page": 1, "results": [], "total_pages": 0, "total_results": 0}

    movie_id = user_favs[0]
    data = await get_movie_recommendations(movie_id=movie_id, page=page)
    mapped = {
        "page": data.get("page", 1),
        "results": [_map_movie(m) for m in data.get("results", [])],
        "total_pages": data.get("total_pages", 0),
        "total_results": data.get("total_results", 0),
    }
    return mapped


@router.get("/{movie_id}/recommendations", response_model=MovieList)
async def movie_recommendations(movie_id: int, page: int = Query(1, ge=1)):
    data = await get_movie_recommendations(movie_id=movie_id, page=page)
    mapped = {
        "page": data.get("page", 1),
        "results": [_map_movie(m) for m in data.get("results", [])],
        "total_pages": data.get("total_pages", 0),
        "total_results": data.get("total_results", 0),
    }
    return mapped


@router.get("/{movie_id}", response_model=Movie)
async def movie_details(movie_id: int):
    data = await get_movie_detail(movie_id)
    return _map_movie(data)
