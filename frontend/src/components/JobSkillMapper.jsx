import React, { useState, useEffect } from 'react';
import './JobSkillMapper.css';

const JobSkillMapper = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [jobSkills, setJobSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/skills/jobs');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.message);
    }
  };

  const handleJobSelect = async (jobName) => {
    if (!jobName) {
      setSelectedJob('');
      setJobSkills([]);
      return;
    }

    setSelectedJob(jobName);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/skills/jobs/${encodeURIComponent(jobName)}/skills`);
      if (!response.ok) throw new Error('Failed to fetch job skills');
      const data = await response.json();
      setJobSkills(data.required_skills);
    } catch (error) {
      console.error('Error fetching job skills:', error);
      setError(error.message);
      setJobSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': '#27ae60',
      'Intermediate': '#f39c12',
      'Advanced': '#e74c3c'
    };
    return colors[difficulty] || '#95a5a6';
  };

  const getImportanceWidth = (importance) => {
    return `${(importance / 10) * 100}%`;
  };

  return (
    <div className="job-mapper-container">
      <div className="header">
        <h1>🎯 Job Role → Skills Mapper</h1>
        <p>Discover which skills are required for different career paths</p>
      </div>

      <div className="job-selector-card">
        <label htmlFor="job-select">Select a Job Role:</label>
        <select
          id="job-select"
          value={selectedJob}
          onChange={(e) => handleJobSelect(e.target.value)}
          disabled={jobs.length === 0}
        >
          <option value="">-- Choose a job role --</option>
          {jobs.map(job => (
            <option key={job.name} value={job.name}>
              {job.name} ({job.level}) - Demand Score: {job.demand_score}
            </option>
          ))}
        </select>

        {jobs.length === 0 && !error && (
          <p className="info-text">Loading available job roles...</p>
        )}
      </div>

      {error && (
        <div className="error-message">
          ⚠️ Error: {error}
        </div>
      )}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading skills for {selectedJob}...</p>
        </div>
      )}

      {!loading && jobSkills.length > 0 && (
        <div className="skills-section">
          <div className="section-header">
            <h2>Required Skills for {selectedJob}</h2>
            <span className="skill-count">{jobSkills.length} skills required</span>
          </div>

          <div className="skills-grid">
            {jobSkills.map((skill, index) => (
              <div
                key={index}
                className="skill-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="skill-header">
                  <h3>{skill.skill}</h3>
                  <span
                    className="difficulty-badge"
                    style={{ background: getDifficultyColor(skill.difficulty) }}
                  >
                    {skill.difficulty}
                  </span>
                </div>

                <div className="skill-category">
                  <span className="category-icon">📚</span>
                  <span>{skill.category}</span>
                </div>

                <div className="importance-section">
                  <div className="importance-label">
                    <span>Importance</span>
                    <span className="importance-score">{skill.importance}/10</span>
                  </div>
                  <div className="importance-bar">
                    <div
                      className="importance-fill"
                      style={{ width: getImportanceWidth(skill.importance) }}
                    >
                      <span className="importance-percent">
                        {Math.round((skill.importance / 10) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="skill-priority">
                  {skill.importance >= 9 && (
                    <span className="priority-badge critical">🔥 Critical</span>
                  )}
                  {skill.importance >= 7 && skill.importance < 9 && (
                    <span className="priority-badge high">⭐ High Priority</span>
                  )}
                  {skill.importance < 7 && (
                    <span className="priority-badge medium">✓ Important</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="skills-summary">
            <h3>Skills Summary</h3>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-number">{jobSkills.length}</span>
                <span className="stat-label">Total Skills</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {jobSkills.filter(s => s.importance >= 9).length}
                </span>
                <span className="stat-label">Critical Skills</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {(jobSkills.reduce((sum, s) => sum + s.importance, 0) / jobSkills.length).toFixed(1)}
                </span>
                <span className="stat-label">Avg Importance</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && selectedJob && jobSkills.length === 0 && !error && (
        <div className="empty-state">
          <p>No skills found for this job role.</p>
        </div>
      )}
    </div>
  );
};

export default JobSkillMapper;
