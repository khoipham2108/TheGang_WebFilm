from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    birthday: Optional[str] = None


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    birthday: Optional[str] = None


class AuthResponse(BaseModel):
    success: bool
    message: str
    user: Optional[UserOut] = None
    token: Optional[str] = None
