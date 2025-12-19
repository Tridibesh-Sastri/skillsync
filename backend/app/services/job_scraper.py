import requests
from bs4 import BeautifulSoup
import spacy
from collections import Counter
from typing import List, Dict
import re
import os
from serpapi import GoogleSearch

# Load NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import en_core_web_sm
    nlp = en_core_web_sm.load()

class JobSkillExtractor:
    def __init__(self):
        # Extended dictionary of skills to catch non-tech roles too
        self.common_skills = [
            # Tech
            "python", "java", "javascript", "react", "node.js", "sql", "aws", "docker",
            "kubernetes", "machine learning", "communication", "problem solving",
            # General / Business
            "project management", "excel", "sales", "marketing", "leadership", 
            "analysis", "writing", "customer service", "strategic planning",
            # Healthcare (example of "any role")
            "patient care", "nursing", "diagnosis", "triage", "medical records"
        ]
        
        # Get API key from environment variable or hardcode it for the hackathon
        self.serpapi_key = os.getenv("SERPAPI_KEY", "YOUR_API_KEY_HERE_IF_YOU_HAVE_ONE")

    def scrape_jobs(self, job_title: str, location: str = "India") -> List[str]:
        """
        Smart Scraper:
        1. Tries Google Jobs API (SerpApi) first for premium data.
        2. Falls back to PostJobFree (Direct Scraping) if no API key or error.
        """
        descriptions = []
        
        # METHOD 1: Google Jobs via SerpApi (Best Quality)
        if self.serpapi_key and "YOUR_API_KEY" not in self.serpapi_key:
            print(f"🚀 Scraping Google Jobs for '{job_title}' via SerpApi...")
            try:
                params = {
                    "engine": "google_jobs",
                    "q": job_title,
                    "location": location,
                    "api_key": self.serpapi_key,
                    "num": 10
                }
                search = GoogleSearch(params)
                results = search.get_dict()
                
                if "jobs_results" in results:
                    for job in results["jobs_results"]:
                        # Combine description and highlights for best context
                        desc = job.get("description", "")
                        highlights = " ".join([h.get("items", [""])[0] for h in job.get("job_highlights", [])])
                        descriptions.append(f"{desc} {highlights}")
                    
                    print(f"✅ Found {len(descriptions)} jobs via Google API.")
                    return descriptions
            except Exception as e:
                print(f"⚠️ SerpApi failed: {e}. Falling back...")

        # METHOD 2: PostJobFree Direct Scraping (Fallback - No Key Needed)
        print(f"📡 Scraping PostJobFree for '{job_title}' (No API Key mode)...")
        try:
            # PostJobFree is very scraper-friendly
            url = f"https://www.postjobfree.com/jobs?q={job_title}&l={location}"
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            
            response = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find job links
            job_links = []
            for a in soup.find_all('a', href=True):
                if '/job/' in a['href']:
                    job_links.append("https://www.postjobfree.com" + a['href'])
            
            # Visit top 5 job pages to get full text
            for link in job_links[:5]:
                try:
                    job_resp = requests.get(link, headers=headers, timeout=5)
                    job_soup = BeautifulSoup(job_resp.content, 'html.parser')
                    # The job description is usually in a specific div or just the body text
                    desc_text = job_soup.get_text(separator=" ", strip=True)
                    descriptions.append(desc_text)
                except:
                    continue
                    
            print(f"✅ Found {len(descriptions)} jobs via direct scraping.")
            return descriptions

        except Exception as e:
            print(f"❌ All scraping methods failed: {e}")
            return []

    def extract_skills(self, job_descriptions: List[str]) -> Dict:
        """Extract skills using NLP + Keyword matching"""
        all_skills = []
        
        for desc in job_descriptions:
            text = desc.lower()
            doc = nlp(text[:10000]) # Limit length for speed
            
            # 1. NLP Noun Chunks (Finds "Project Management", "Data Analysis")
            for chunk in doc.noun_chunks:
                clean_chunk = chunk.text.strip()
                # Filter out garbage (too short/long)
                if 3 < len(clean_chunk) < 25:
                     # Check if it looks like a skill (optional: match against a massive list)
                     # For demo, we trust noun chunks that appear frequently
                     all_skills.append(clean_chunk)
            
            # 2. Known Keyword Matching (Ensures we catch specific tech)
            for skill in self.common_skills:
                if skill in text:
                    all_skills.append(skill)

        # Count frequency
        skill_counts = Counter(all_skills)
        total = len(job_descriptions) if job_descriptions else 1
        
        # Filter and Format
        ranked_skills = {}
        # Get top 20 most frequent terms
        for skill, count in skill_counts.most_common(20):
            # simple filter to remove common words that aren't skills
            if skill not in ["experience", "years", "team", "work", "skills", "job", "knowledge"]:
                ranked_skills[skill] = {
                    "count": count,
                    "demand_percentage": round((count / total) * 100, 1),
                    "priority": "high" if (count/total) > 0.5 else "medium"
                }
                
        return ranked_skills

extractor = JobSkillExtractor()
