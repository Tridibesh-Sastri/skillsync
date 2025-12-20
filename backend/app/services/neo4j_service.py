from neo4j import GraphDatabase
from typing import Dict, List
import os

class Neo4jService:
    def __init__(self):
        uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        user = os.getenv("NEO4J_USER", "neo4j")
        password = os.getenv("NEO4J_PASSWORD", "password")
        
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
    
    def close(self):
        self.driver.close()
    
    def update_job_skills(self, job_title: str, skills: Dict):
        """Create/update JobRole -> DEMANDS -> Skill relationships"""
        skill_list = [
            {"name": name, "demand": data["demand_percentage"], "priority": data["priority"]}
            for name, data in skills.items()
        ]
        
        with self.driver.session() as session:
            session.run("""
                MERGE (j:JobRole {name: $job_title})
                WITH j
                UNWIND $skills AS skill
                MERGE (s:Skill {name: skill.name})
                MERGE (j)-[r:DEMANDS]->(s)
                SET r.demand_percentage = skill.demand,
                    r.priority = skill.priority,
                    r.updated_at = datetime()
            """, job_title=job_title, skills=skill_list)
    
    def get_skill_graph(self) -> Dict:
        """Get complete skill graph for D3.js visualization"""
        with self.driver.session() as session:
            result = session.run("""
                MATCH (n)-[r]->(m)
                RETURN n, r, m
            """)
            
            nodes = []
            links = []
            node_ids = set()
            
            for record in result:
                n = record["n"]
                m = record["m"]
                r = record["r"]
                
                # Add nodes
                if n.id not in node_ids:
                    nodes.append({
                        "id": n.id,
                        "name": n["name"],
                        "type": list(n.labels)[0]
                    })
                    node_ids.add(n.id)
                
                if m.id not in node_ids:
                    nodes.append({
                        "id": m.id,
                        "name": m["name"],
                        "type": list(m.labels)[0]
                    })
                    node_ids.add(m.id)
                
                # Add links
                links.append({
                    "source": n.id,
                    "target": m.id,
                    "type": r.type
                })
            
            return {"nodes": nodes, "links": links}
    
    def get_job_skills(self, job_role: str) -> List[Dict]:
        """Get all skills demanded by a specific job role"""
        with self.driver.session() as session:
            result = session.run("""
                MATCH (j:JobRole {name: $job_role})-[r:DEMANDS]->(s:Skill)
                RETURN s.name as skill, 
                       r.demand_percentage as demand,
                       r.priority as priority
                ORDER BY r.demand_percentage DESC
            """, job_role=job_role)
            
            return [dict(record) for record in result]
    
    def get_trending_skills(self) -> List[Dict]:
        """Show trending skills across all job roles"""
        with self.driver.session() as session:
            result = session.run("""
                MATCH (s:Skill)<-[r:DEMANDS]-(j:JobRole)
                RETURN s.name as skill, 
                       count(j) as job_count,
                       avg(r.demand_percentage) as avg_demand
                ORDER BY job_count DESC, avg_demand DESC
                LIMIT 10
            """)
            return [dict(record) for record in result]
