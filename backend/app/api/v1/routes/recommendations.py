from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_recommendations():
    return {
        "recommendations": [
            "Learn FastAPI deeply",
            "Build REST APIs",
            "Practice Docker daily"
        ]
    }
