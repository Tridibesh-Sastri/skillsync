from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_recommendations():
    return {
        "recommendations": [
            "Learn FastAPI fundamentals",
            "Practice Docker multi-container setups"
        ],
        "source": "rule-based (AI-ready)"
    }
