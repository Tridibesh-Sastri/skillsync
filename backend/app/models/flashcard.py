from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Flashcard(Base):
    __tablename__ = "flashcards"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)
    difficulty = Column(String(20), default="Medium")  # Easy, Medium, Hard
    
    # SM-2 Algorithm fields
    repetitions = Column(Integer, default=0)
    easiness_factor = Column(Float, default=2.5)
    interval = Column(Integer, default=0)
    next_review = Column(DateTime, nullable=True)
    last_reviewed = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    is_active = Column(Boolean, default=True)
    
    # Relationship
    user = relationship("User", back_populates="flashcards")
