from sqlalchemy import Column, Integer, Float, ForeignKey
from app.core.database import Base


class LearningProgress(Base):
    __tablename__ = "learning_progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    readiness_score = Column(Float, default=0.0)
