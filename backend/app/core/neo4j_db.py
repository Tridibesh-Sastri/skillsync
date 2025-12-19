from neo4j import GraphDatabase
from app.core.config import settings

class Neo4jConnection:
    def __init__(self):
        self.driver = None
        self.uri = settings.NEO4J_URI
        self.user = settings.NEO4J_USER
        self.password = settings.NEO4J_PASSWORD
    
    def connect(self):
        """Establish connection to Neo4j"""
        try:
            self.driver = GraphDatabase.driver(
                self.uri,
                auth=(self.user, self.password)
            )
            # Test connection
            self.driver.verify_connectivity()
            print("✅ Neo4j connection successful")
        except Exception as e:
            print(f"❌ Neo4j connection failed: {e}")
            raise
    
    def close(self):
        """Close the Neo4j connection"""
        if self.driver:
            self.driver.close()
            print("Neo4j connection closed")
    
    def execute_query(self, query: str, parameters: dict = None):
        """Execute a Cypher query"""
        with self.driver.session() as session:
            result = session.run(query, parameters or {})
            return [record.data() for record in result]
    
    def execute_write(self, query: str, parameters: dict = None):
        """Execute a write transaction"""
        with self.driver.session() as session:
            result = session.execute_write(
                lambda tx: tx.run(query, parameters or {})
            )
            return result

# Global Neo4j connection instance
neo4j_conn = Neo4jConnection()

def get_neo4j():
    """Dependency for Neo4j connection"""
    return neo4j_conn
