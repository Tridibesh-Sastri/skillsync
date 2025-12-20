from fastapi import APIRouter, HTTPException
from app.services.job_scraper import JobSkillExtractor
from app.services.neo4j_service import Neo4jService

router = APIRouter(prefix="/api/jobs", tags=["jobs"])
extractor = JobSkillExtractor()
neo4j = Neo4jService()

@router.post("/scrape-and-analyze")
def scrape_and_analyze_job(job_title: str):
    """
    Scrape job postings and extract in-demand skills using AI
    """
    try:
        # Scrape jobs
        job_descriptions = extractor.scrape_linkedin_jobs(job_title)
        
        # Extract skills with NLP
        skills = extractor.extract_skills(job_descriptions)
        
        # Update Neo4j knowledge graph
        neo4j.update_job_skills(job_title, skills)
        
        return {
            "job_title": job_title,
            "total_jobs_analyzed": len(job_descriptions),
            "top_skills": skills,
            "insight": f"Based on {len(job_descriptions)} real job postings"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/market-trends")
def get_market_trends():
    """Show trending skills across all job roles"""
    return neo4j.get_trending_skills()
