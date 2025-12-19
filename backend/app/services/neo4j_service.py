def update_job_skills(self, job_title: str, skills: dict):
    """Create/update JobRole->DEMANDS->Skill relationships"""
    with self.driver.session() as session:
        session.run("""
            MERGE (j:JobRole {name: $job_title})
            SET j.updated_at = datetime()
        """, job_title=job_title)
        
        for skill, data in skills.items():
            session.run("""
                MERGE (s:Skill {name: $skill})
                MERGE (j:JobRole {name: $job_title})
                MERGE (j)-[r:DEMANDS]->(s)
                SET r.demand_percentage = $demand,
                    r.priority = $priority,
                    r.count = $count
            """, 
            skill=skill, 
            job_title=job_title,
            demand=data["demand_percentage"],
            priority=data["priority"],
            count=data["count"])

def get_trending_skills(self):
    """Get top skills across all jobs"""
    with self.driver.session() as session:
        result = session.run("""
            MATCH (j:JobRole)-[r:DEMANDS]->(s:Skill)
            RETURN s.name as skill, 
                   avg(r.demand_percentage) as avg_demand,
                   count(j) as job_count
            ORDER BY avg_demand DESC
            LIMIT 10
        """)
        return [dict(record) for record in result]
