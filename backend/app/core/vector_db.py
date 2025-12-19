import chromadb
from chromadb.config import Settings
import os

def get_chroma_client():
    return chromadb.HttpClient(
        host=os.getenv("CHROMA_HOST", "chromadb"),
        port=os.getenv("CHROMA_PORT", "8000"),
        settings=Settings(
            allow_reset=True,
            anonymized_telemetry=False
        )
    )
