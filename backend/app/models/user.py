from pydantic import BaseModel, EmailStr
from uuid import UUID, uuid4
from datetime import datetime

class User(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    created_at: datetime
