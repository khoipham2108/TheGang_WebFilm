from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import movies as movies_router
import os

_origin_env = os.environ.get("FRONTEND_ORIGIN")
if _origin_env:
    FRONTEND_ORIGINS = [o.strip() for o in _origin_env.split(',') if o.strip()]
else:
    FRONTEND_ORIGINS = ["http://localhost:3000", "http://localhost:5173"]

app = FastAPI(title="Movies API", docs_url="/docs", redoc_url="/redoc")

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-Requested-With"],
)

app.include_router(movies_router.router, prefix="/api/movies", tags=["movies"])
from app.routers import auth as auth_router

app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"])
try:
    demo = getattr(auth_router, 'seed_demo_user', None)
    if callable(demo):
        demo()
except Exception:
    pass
from app.routers import preferences as preferences_router

app.include_router(preferences_router.router, prefix="/api/preferences", tags=["preferences"])
