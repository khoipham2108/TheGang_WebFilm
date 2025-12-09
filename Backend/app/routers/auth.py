from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
from typing import Dict
import hashlib
import jwt

from ..config import get_settings
from ..schemas.auth import LoginRequest, SignupRequest, AuthResponse, UserOut

router = APIRouter()
settings = get_settings()

_users: Dict[int, Dict] = {}
_email_index: Dict[str, int] = {}
_next_id = 1


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def _create_token(user_id: int) -> str:
    payload = {
        'sub': user_id,
        'exp': datetime.utcnow() + timedelta(seconds=settings.JWT_EXPIRES_SECONDS),
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token


def seed_demo_user(username: str = "demo", email: str = "demo@example.com", password: str = "secret") -> Dict:
    """Create a demo user in the in-memory store if it doesn't exist.

    Returns the created or existing user dict (without password_hash).
    """
    global _next_id
    if email in _email_index:
        uid = _email_index[email]
        u = _users.get(uid)
        return {k: v for k, v in u.items() if k != 'password_hash'}

    user_id = _next_id
    _next_id += 1
    user = {
        'id': user_id,
        'username': username,
        'email': email,
        'password_hash': _hash_password(password),
        'birthday': None,
        'created_at': datetime.utcnow().isoformat(),
    }
    _users[user_id] = user
    _email_index[email] = user_id
    return {k: v for k, v in user.items() if k != 'password_hash'}


@router.post('/signup', response_model=AuthResponse)
async def signup(req: SignupRequest):
    global _next_id
    if req.email in _email_index:
        return AuthResponse(success=False, message='Email already registered')

    user_id = _next_id
    _next_id += 1
    user = {
        'id': user_id,
        'username': req.username,
        'email': req.email,
        'password_hash': _hash_password(req.password),
        'birthday': req.birthday,
        'created_at': datetime.utcnow().isoformat(),
    }
    _users[user_id] = user
    _email_index[req.email] = user_id

    token = _create_token(user_id)
    user_out = UserOut(id=user_id, username=req.username, email=req.email, birthday=req.birthday)
    return AuthResponse(success=True, message='User created', user=user_out, token=token)


@router.post('/login', response_model=AuthResponse)
async def login(req: LoginRequest):
    uid = _email_index.get(req.email)
    if not uid:
        return AuthResponse(success=False, message='Invalid credentials')
    user = _users.get(uid)
    if not user or user.get('password_hash') != _hash_password(req.password):
        return AuthResponse(success=False, message='Invalid credentials')

    token = _create_token(uid)
    user_out = UserOut(id=uid, username=user['username'], email=user['email'], birthday=user.get('birthday'))
    return AuthResponse(success=True, message='Login successful', user=user_out, token=token)


@router.post('/logout')
async def logout():
    return {'success': True, 'message': 'Logged out'}


@router.get('/verify')
async def verify(token: str):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id = payload.get('sub')
        if user_id not in _users:
            raise HTTPException(status_code=401, detail='Invalid token')
        return {'success': True, 'message': 'Token valid'}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expired')
    except Exception:
        raise HTTPException(status_code=401, detail='Invalid token')
