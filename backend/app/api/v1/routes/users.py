from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class UserCreate(BaseModel):
    name: str
    goal: str

@router.post("/")
def create_user(user: UserCreate):
    return {
        "message": "User created",
        "user": user
    }
