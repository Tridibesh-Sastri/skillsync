from typing import List, Dict

class LearningResourceFinder:
    """
    Curates learning resources for skills
    """
    
    def __init__(self):
        # Pre-curated resources database
        self.youtube_resources = {
            "python": [
                {"title": "Python Full Course", "url": "https://youtube.com/watch?v=_uQrJ0TkZlc", "duration": "4h 26m"},
                {"title": "Python Tutorial for Beginners", "url": "https://youtube.com/watch?v=rfscVS0vtbw", "duration": "6h 14m"},
                {"title": "Python OOP Tutorial", "url": "https://youtube.com/watch?v=JeznW_7DlB0", "duration": "51m"}
            ],
            "machine learning": [
                {"title": "Machine Learning Full Course", "url": "https://youtube.com/watch?v=GwIo3gDZCVQ", "duration": "10h"},
                {"title": "ML for Beginners", "url": "https://youtube.com/watch?v=Gv9_4yMHFhI", "duration": "3h 45m"}
            ],
            "fastapi": [
                {"title": "FastAPI Tutorial", "url": "https://youtube.com/watch?v=0RS9W8MtZe4", "duration": "2h 18m"},
                {"title": "FastAPI Crash Course", "url": "https://youtube.com/watch?v=7t2alSnE2-I", "duration": "1h 30m"}
            ]
        }
        
        self.documentation = {
            "python": [
                {"title": "Official Python Docs", "url": "https://docs.python.org/3/"},
                {"title": "Real Python Tutorials", "url": "https://realpython.com/"}
            ],
            "machine learning": [
                {"title": "Scikit-learn Documentation", "url": "https://scikit-learn.org/"},
                {"title": "Google ML Crash Course", "url": "https://developers.google.com/machine-learning/crash-course"}
            ],
            "fastapi": [
                {"title": "FastAPI Official Docs", "url": "https://fastapi.tiangolo.com/"}
            ]
        }
    
    def find_youtube_videos(self, skill: str, max_results: int = 5) -> List[Dict]:
        """Find curated YouTube videos for a skill"""
        skill_lower = skill.lower()
        return self.youtube_resources.get(skill_lower, [])[:max_results]
    
    def find_documentation(self, skill: str) -> List[Dict]:
        """Find official documentation and tutorials"""
        skill_lower = skill.lower()
        return self.documentation.get(skill_lower, [])
