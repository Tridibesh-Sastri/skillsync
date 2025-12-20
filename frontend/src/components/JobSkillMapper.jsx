import React, { useState } from 'react';
import api from '../services/api';
import './JobSkillMapper.css';

const JobSkillMapper = () => {
  const [jobTitle, setJobTitle] = useState('ML Engineer');
  const [skills, setSkills] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setSkills(null);
    try {
      const response = await api.scrapeAndAnalyzeJob(jobTitle);
      setSkills(response.data.top_skills);
    } catch (error) {
      console.error("Failed to analyze job:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="job-mapper-container">
      <div className="input-group">
        <select value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}>
          <option value="ML Engineer">ML Engineer</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Data Scientist">Data Scientist</option>
        </select>
        <button onClick={handleAnalyze} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Market Demand'}
        </button>
      </div>
      {skills && (
        <div className="skills-grid">
          {Object.entries(skills).map(([skill, data]) => (
            <div key={skill} className={`skill-card ${data.priority}`}>
              <h3>{skill}</h3>
              <p>{data.demand_percentage}% Demand</p>
              <span>Priority: {data.priority}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobSkillMapper;
