# filepath: backend/app/api/v1/routes/jobs.py
from fastapi import APIRouter
from app.services.job_scraper import extractor
# Assuming you have a Neo4j service instance available. 
# If not, we'll mock it or import it if you've created it.
# from app.services.neo4j_service import neo4j_service 


router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.post("/scrape-and-analyze")
def scrape_and_analyze_job(job_title: str):
    """Real-world scraper for ANY job role"""
    
    # 1. Scrape real jobs (Google or Direct)
    job_descriptions = extractor.scrape_jobs(job_title)
    
    if not job_descriptions:
        return {"error": "Could not find any jobs. Try a more common job title."}
    
    # 2. Extract skills
    skills = extractor.extract_skills(job_descriptions)
    
    return {
        "job_title": job_title,
        "total_jobs_analyzed": len(job_descriptions),
        "top_skills": skills,
        "insight": f"Analysis based on {len(job_descriptions)} live job postings."
    }

@router.get("/market-trends")
def get_market_trends():
    """Show trending skills across all job roles (Mock for now)"""
    # This would normally query Neo4j
    return [
        {"skill": "Python", "avg_demand": 85.0, "job_count": 15},
        {"skill": "React", "avg_demand": 72.0, "job_count": 12},
        {"skill": "Docker", "avg_demand": 60.0, "job_count": 10}
    ]
