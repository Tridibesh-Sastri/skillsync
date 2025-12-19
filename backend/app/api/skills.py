from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
from app.core.neo4j_db import get_neo4j, Neo4jConnection

router = APIRouter(prefix="/api/skills", tags=["skills"])

@router.get("/")
def get_all_skills(neo4j: Neo4jConnection = Depends(get_neo4j)):
    """Get all skills from Neo4j graph database"""
    query = """
    MATCH (s:Skill)
    RETURN s.name as name, s.category as category, s.difficulty as difficulty
    ORDER BY s.name
    """
    try:
        results = neo4j.execute_query(query)
        return {"skills": results, "count": len(results)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Neo4j query failed: {str(e)}")

@router.get("/job/{job_role}")
def get_skills_for_job(job_role: str, neo4j: Neo4jConnection = Depends(get_neo4j)):
    """Get skills required for a specific job role"""
    query = """
    MATCH (j:JobRole {name: $job_role})-[r:REQUIRES]->(s:Skill)
    RETURN s.name as skill, s.category as category, 
           s.difficulty as difficulty, r.importance as importance
    ORDER BY r.importance DESC
    """
    try:
        results = neo4j.execute_query(query, {"job_role": job_role})
        if not results:
            raise HTTPException(status_code=404, detail=f"Job role '{job_role}' not found")
        return {"job_role": job_role, "required_skills": results}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@router.post("/")
def create_skill(name: str, category: str, difficulty: str, neo4j: Neo4jConnection = Depends(get_neo4j)):
    """Create a new skill node"""
    query = """
    CREATE (s:Skill {name: $name, category: $category, difficulty: $difficulty})
    RETURN s.name as name, s.category as category, s.difficulty as difficulty
    """
    try:
        result = neo4j.execute_write(query, {
            "name": name,
            "category": category,
            "difficulty": difficulty
        })
        return {"message": "Skill created successfully", "skill": name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create skill: {str(e)}")
