from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class FlashcardBase(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000)
    answer: str = Field(..., min_length=1, max_length=2000)
    category: Optional[str] = Field(None, max_length=100)
    difficulty: Optional[str] = Field("Medium", pattern="^(Easy|Medium|Hard)$")

class FlashcardCreate(FlashcardBase):
    pass

class FlashcardUpdate(BaseModel):
    question: Optional[str] = Field(None, min_length=1, max_length=1000)
    answer: Optional[str] = Field(None, min_length=1, max_length=2000)
    category: Optional[str] = Field(None, max_length=100)
    difficulty: Optional[str] = Field(None, pattern="^(Easy|Medium|Hard)$")

class FlashcardResponse(FlashcardBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True
