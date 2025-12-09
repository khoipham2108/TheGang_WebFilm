from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Set, List

from ..services import tmdb_service
from ..config import get_settings

router = APIRouter()
settings = get_settings()

# In-memory favorites store: user_id -> set of movie_ids
_favorites: Dict[int, Set[int]] = {}


class FavoriteAction(BaseModel):
    user_id: int
    movie_id: int


@router.post('/movies/add')
async def add_favorite(action: FavoriteAction):
    user_set = _favorites.setdefault(action.user_id, set())
    user_set.add(action.movie_id)
    return {'success': True, 'message': 'Movie added to favorites'}


@router.post('/movies/remove')
async def remove_favorite(action: FavoriteAction):
    user_set = _favorites.setdefault(action.user_id, set())
    user_set.discard(action.movie_id)
    return {'success': True, 'message': 'Movie removed from favorites'}


@router.get('/{user_id}/movies')
async def get_user_favorites(user_id: int):
    movie_ids = list(_favorites.get(user_id, set()))
    results: List[dict] = []
    for mid in movie_ids:
        try:
            data = await tmdb_service.get_movie_detail(mid)
            # simplified mapping similar to movies router
            poster_path = data.get('poster_path')
            poster_url = f"{settings.TMDB_IMAGE_BASE_URL}{poster_path}" if poster_path else None
            mapped = {
                'id': data.get('id'),
                'title': data.get('title') or data.get('name'),
                'overview': data.get('overview'),
                'poster_path': poster_path,
                'poster_url': poster_url,
                'release_date': data.get('release_date') or data.get('first_air_date'),
                'vote_average': data.get('vote_average'),
            }
            results.append(mapped)
        except HTTPException as e:
            # skip missing movies
            continue

    return {'success': True, 'results': results}
