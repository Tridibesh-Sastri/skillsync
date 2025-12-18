from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_skills():
    return {
        "skills": [
            {"id": 1, "name": "Python"},
            {"id": 2, "name": "FastAPI"},
            {"id": 3, "name": "Docker"}
        ]
    }
