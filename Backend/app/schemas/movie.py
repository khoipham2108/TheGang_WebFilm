from pydantic import BaseModel
from typing import Optional, List


class Movie(BaseModel):
    id: int
    title: str
    overview: Optional[str] = None
    poster_path: Optional[str] = None
    poster_url: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: Optional[float] = None


class MovieList(BaseModel):
    page: int
    results: List[Movie]
    total_pages: int
    total_results: int
