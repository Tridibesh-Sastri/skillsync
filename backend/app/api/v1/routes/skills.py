from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_skills():
    return {
        "skills": ["Python", "FastAPI", "Docker", "React", "AI Fundamentals"]
    }
