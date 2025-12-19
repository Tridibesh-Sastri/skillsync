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


@router.get("/graph")
def get_skills_graph(neo4j: Neo4jConnection = Depends(get_neo4j)):
    """
    Get complete skill graph with nodes and relationships for D3.js visualization
    Returns nodes and links in format ready for force-directed graph
    """
    query = """
    MATCH (s:Skill)
    OPTIONAL MATCH (s)-[r:PREREQUISITE]->(s2:Skill)
    RETURN s.name as skill, s.category as category, s.difficulty as difficulty,
           COLLECT({target: s2.name, relationship: type(r)}) as connections
    """
    try:
        results = neo4j.execute_query(query)
        
        # Format for D3.js force-directed graph
        nodes = []
        links = []
        node_map = {}
        
        # Create nodes
        for i, record in enumerate(results):
            node_id = i
            node_map[record['skill']] = node_id
            nodes.append({
                "id": node_id,
                "name": record['skill'],
                "category": record['category'],
                "difficulty": record['difficulty']
            })
        
        # Create links from connections
        for i, record in enumerate(results):
            source_id = i
            for conn in record['connections']:
                if conn['target'] and conn['target'] in node_map:
                    links.append({
                        "source": source_id,
                        "target": node_map[conn['target']],
                        "type": conn['relationship']
                    })
        
        return {
            "nodes": nodes, 
            "links": links,
            "stats": {
                "total_skills": len(nodes),
                "total_connections": len(links)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to build graph: {str(e)}")


@router.get("/jobs")
def get_all_job_roles(neo4j: Neo4jConnection = Depends(get_neo4j)):
    """Get all job roles in the system with their metadata"""
    query = """
    MATCH (j:JobRole)
    RETURN j.name as name, j.level as level, j.demand_score as demand_score
    ORDER BY j.demand_score DESC
    """
    try:
        results = neo4j.execute_query(query)
        return {"jobs": results, "count": len(results)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch jobs: {str(e)}")


@router.get("/jobs/{job_name}")
def get_job_details(job_name: str, neo4j: Neo4jConnection = Depends(get_neo4j)):
    """Get detailed information about a specific job role"""
    query = """
    MATCH (j:JobRole {name: $job_name})
    RETURN j.name as name, j.level as level, j.demand_score as demand_score
    """
    try:
        results = neo4j.execute_query(query, {"job_name": job_name})
        if not results:
            raise HTTPException(status_code=404, detail=f"Job role '{job_name}' not found")
        return results[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/jobs/{job_name}/skills")
def get_skills_for_job(job_name: str, neo4j: Neo4jConnection = Depends(get_neo4j)):
    """Get skills required for a specific job role"""
    query = """
    MATCH (j:JobRole {name: $job_name})-[r:REQUIRES]->(s:Skill)
    RETURN s.name as skill, s.category as category, 
           s.difficulty as difficulty, r.importance as importance
    ORDER BY r.importance DESC
    """
    try:
        results = neo4j.execute_query(query, {"job_name": job_name})
        if not results:
            raise HTTPException(status_code=404, detail=f"Job role '{job_name}' not found")
        return {"job_role": job_name, "required_skills": results, "count": len(results)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@router.get("/jobs/{job_name}/graph")
def get_job_skill_graph(job_name: str, neo4j: Neo4jConnection = Depends(get_neo4j)):
    """
    Get graph showing job and its required skills
    Format optimized for visualization
    """
    query = """
    MATCH (j:JobRole {name: $job_name})-[r:REQUIRES]->(s:Skill)
    RETURN j.name as job, s.name as skill, s.category as category,
           s.difficulty as difficulty, r.importance as importance
    ORDER BY r.importance DESC
    """
    try:
        results = neo4j.execute_query(query, {"job_name": job_name})
        if not results:
            raise HTTPException(status_code=404, detail=f"Job role '{job_name}' not found")
        
        # Central job node
        job_node = {
            "id": 0, 
            "name": results[0]['job'], 
            "type": "job",
            "level": "center"
        }
        
        # Skill nodes around it
        skill_nodes = []
        links = []
        
        for i, record in enumerate(results, start=1):
            skill_nodes.append({
                "id": i,
                "name": record['skill'],
                "category": record['category'],
                "difficulty": record['difficulty'],
                "type": "skill"
            })
            links.append({
                "source": 0,  # Job node
                "target": i,  # Skill node
                "importance": record['importance'],
                "label": f"requires ({record['importance']}/10)"
            })
        
        nodes = [job_node] + skill_nodes
        
        return {
            "nodes": nodes, 
            "links": links,
            "job_role": job_name,
            "stats": {
                "required_skills": len(skill_nodes),
                "avg_importance": sum(r['importance'] for r in results) / len(results)
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
def create_skill(
    name: str, 
    category: str, 
    difficulty: str, 
    neo4j: Neo4jConnection = Depends(get_neo4j)
):
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
