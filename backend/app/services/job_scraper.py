import spacy
from collections import Counter
from typing import List, Dict

class JobSkillExtractor:
    """
    AI-powered skill extraction from job descriptions using NLP
    """
    
    def __init__(self):
        # Load English language model
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("⚠️ Model 'en_core_web_sm' not found. Downloading...")
            from spacy.cli import download
            download("en_core_web_sm")
            self.nlp = spacy.load("en_core_web_sm")

        # Define skill keywords (expandable taxonomy)
        self.skill_keywords = [
            "python", "java", "javascript", "typescript", "react", "vue", "angular",
            "node.js", "fastapi", "django", "flask", "spring boot",
            "machine learning", "deep learning", "nlp", "computer vision",
            "pytorch", "tensorflow", "scikit-learn", "pandas", "numpy",
            "docker", "kubernetes", "aws", "azure", "gcp", "terraform",
            "postgresql", "mongodb", "neo4j", "redis", "elasticsearch",
            "git", "ci/cd", "jenkins", "github actions",
            "agile", "scrum", "rest api", "graphql", "microservices"
        ]
    
    def scrape_linkedin_jobs(self, job_title: str, limit: int = 5) -> List[str]:
        """
        Mock job scraper - returns sample job descriptions
        In production, integrate Selenium or LinkedIn API
        """
        sample_jobs = {
            "ML Engineer": [
                "Strong Python programming. Experience with PyTorch and TensorFlow. 3+ years ML. Proficient in scikit-learn, deep learning algorithms.",
                "ML expertise with NLP and Computer Vision. Python, PyTorch, SQL required. AWS experience preferred.",
                "Senior ML role. Python, TensorFlow, Keras. Experience with neural networks, CNNs, RNNs. Docker, Kubernetes."
            ],
            "Backend Developer": [
                "Expert in Python/FastAPI or Node.js. Strong SQL and NoSQL database knowledge. Docker, Kubernetes.",
                "Backend development with Python/Java. REST APIs, microservices, PostgreSQL. Redis, RabbitMQ experience.",
                "Senior backend role. Python, FastAPI, GraphQL. Redis, Docker, CI/CD pipelines."
            ],
            "Data Scientist": [
                "Data science with Python, pandas, NumPy. Statistical modeling, ML algorithms. SQL expertise.",
                "Data scientist role. Python, scikit-learn, statistical analysis. Experience with A/B testing.",
                "Analytics and ML. Python, R, SQL. AB testing, experimentation. Communication skills."
            ]
        }
        return sample_jobs.get(job_title, sample_jobs["ML Engineer"])
    
    def extract_skills(self, job_descriptions: List[str]) -> Dict[str, Dict]:
        """
        Extract skills using NLP and rank by demand
        Returns: {skill: {count: int, demand_percentage: float, priority: str}}
        """
        all_skills = []
        
        for desc in job_descriptions:
            doc = self.nlp(desc.lower())
            
            # Extract noun chunks and match against skill taxonomy
            for chunk in doc.noun_chunks:
                chunk_text = chunk.text.strip()
                for skill in self.skill_keywords:
                    if skill in chunk_text:
                        all_skills.append(skill)
            
            # Direct keyword matching
            for skill in self.skill_keywords:
                if skill in desc.lower():
                    all_skills.append(skill)
        
        # Calculate demand metrics
        skill_counts = Counter(all_skills)
        total_jobs = len(job_descriptions)
        
        skill_demand = {}
        for skill, count in skill_counts.most_common(20):
            demand_pct = round((count / total_jobs) * 100, 1)
            priority = "high" if count / total_jobs > 0.7 else "medium" if count / total_jobs > 0.4 else "low"
            
            skill_demand[skill] = {
                "count": count,
                "demand_percentage": demand_pct,
                "priority": priority
            }
        
        return skill_demand
