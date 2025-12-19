from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.auth import router as auth_router
from app.api.skills import router as skills_router
from app.core.neo4j_db import neo4j_conn

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to Neo4j
    print("🚀 Starting SkillSync API...")
    try:
        neo4j_conn.connect()
        print("✅ Neo4j connected")
    except Exception as e:
        print(f"⚠️  Neo4j connection failed: {e}")
    
    yield
    
    # Shutdown: Close Neo4j connection
    print("🛑 Shutting down SkillSync API...")
    neo4j_conn.close()

app = FastAPI(
    title="SkillSync API",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(skills_router)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "databases": {
            "postgresql": "connected",
            "neo4j": "connected" if neo4j_conn.driver else "disconnected"
        }
    }
