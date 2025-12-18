from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# IMPORTANT: correct import based on your structure
from app.api.v1.router import api_router


app = FastAPI(
    title="SkillSync API",
    version="1.0.0",
    openapi_url="/openapi.json",
    docs_url="/docs",
)

# ✅ CORS (required for Vite frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for dev, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ API router
app.include_router(api_router, prefix="/api/v1")


# Optional root endpoint (nice to have)
@app.get("/")
def root():
    return {
        "message": "SkillSync backend running",
        "docs": "/docs",
    }
