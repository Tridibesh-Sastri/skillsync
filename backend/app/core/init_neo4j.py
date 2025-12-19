from app.core.neo4j_db import neo4j_conn

def initialize_neo4j_schema():
    """
    Initialize Neo4j database with constraints and indexes
    Run this once when setting up the database
    """
    
    queries = [
        # Create uniqueness constraints
        "CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE",
        "CREATE CONSTRAINT skill_name_unique IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE",
        "CREATE CONSTRAINT concept_name_unique IF NOT EXISTS FOR (c:Concept) REQUIRE c.name IS UNIQUE",
        "CREATE CONSTRAINT job_role_name_unique IF NOT EXISTS FOR (j:JobRole) REQUIRE j.name IS UNIQUE",
        
        # Create indexes for better query performance
        "CREATE INDEX user_email_index IF NOT EXISTS FOR (u:User) ON (u.email)",
        "CREATE INDEX skill_category_index IF NOT EXISTS FOR (s:Skill) ON (s.category)",
        "CREATE INDEX concept_difficulty_index IF NOT EXISTS FOR (c:Concept) ON (c.difficulty)",
    ]
    
    print("🔧 Initializing Neo4j schema...")
    
    for query in queries:
        try:
            neo4j_conn.execute_query(query)
            print(f"✅ Executed: {query[:50]}...")
        except Exception as e:
            print(f"⚠️  Warning: {e}")
    
    print("✅ Neo4j schema initialization complete!")

def create_sample_data():
    """
    Create some sample nodes for testing
    """
    queries = [
        # Create sample skills
        """
        MERGE (s1:Skill {name: 'Python', category: 'Programming Language', difficulty: 'Beginner'})
        MERGE (s2:Skill {name: 'Machine Learning', category: 'AI/ML', difficulty: 'Intermediate'})
        MERGE (s3:Skill {name: 'FastAPI', category: 'Framework', difficulty: 'Intermediate'})
        MERGE (s4:Skill {name: 'Docker', category: 'DevOps', difficulty: 'Intermediate'})
        """,
        
        # Create sample job roles
        """
        MERGE (j1:JobRole {name: 'ML Engineer', level: 'Senior', demand_score: 95})
        MERGE (j2:JobRole {name: 'Backend Developer', level: 'Mid', demand_score: 85})
        """,
        
        # Create relationships
        """
        MATCH (j:JobRole {name: 'ML Engineer'})
        MATCH (s1:Skill {name: 'Python'})
        MATCH (s2:Skill {name: 'Machine Learning'})
        MERGE (j)-[:REQUIRES {importance: 10}]->(s1)
        MERGE (j)-[:REQUIRES {importance: 10}]->(s2)
        """,
        
        """
        MATCH (j:JobRole {name: 'Backend Developer'})
        MATCH (s1:Skill {name: 'Python'})
        MATCH (s3:Skill {name: 'FastAPI'})
        MATCH (s4:Skill {name: 'Docker'})
        MERGE (j)-[:REQUIRES {importance: 9}]->(s1)
        MERGE (j)-[:REQUIRES {importance: 8}]->(s3)
        MERGE (j)-[:REQUIRES {importance: 7}]->(s4)
        """,
    ]
    
    print("📊 Creating sample data...")
    
    for query in queries:
        try:
            neo4j_conn.execute_query(query)
        except Exception as e:
            print(f"⚠️  Error: {e}")
    
    print("✅ Sample data created!")

if __name__ == "__main__":
    neo4j_conn.connect()
    initialize_neo4j_schema()
    create_sample_data()
    neo4j_conn.close()
