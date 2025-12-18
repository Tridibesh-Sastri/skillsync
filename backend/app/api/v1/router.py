from fastapi import APIRouter

from .routes import health, skills, users, recommendations

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(skills.router, prefix="/skills", tags=["Skills"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
