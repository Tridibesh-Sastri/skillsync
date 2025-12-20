import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Your FastAPI backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // --- Job & Skill Endpoints ---
  scrapeAndAnalyzeJob: (jobTitle) => {
    return apiClient.post(`/api/jobs/scrape-and-analyze?job_title=${jobTitle}`);
  },
  getSkillGraph: () => {
    return apiClient.get('/api/skills/graph');
  },

  // --- Flashcard Endpoints ---
  getDueFlashcards: (userId) => {
    return apiClient.get(`/api/flashcards/due/${userId}`);
  },
  reviewFlashcard: (cardId, quality) => {
    return apiClient.post(`/api/flashcards/${cardId}/review?quality=${quality}`);
  },
};
