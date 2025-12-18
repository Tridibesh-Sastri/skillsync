from fastapi import APIRouter

router = APIRouter()

_fake_users = []

@router.get("/")
def list_users():
    return _fake_users

@router.post("/")
def create_user(user: dict):
    _fake_users.append(user)
    return user
