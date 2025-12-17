from pydantic import BaseModel
from typing import Generic, TypeVar, Optional
from datetime import datetime

T = TypeVar("T")

class Meta(BaseModel):
    version: str = "v1"
    timestamp: datetime = datetime.utcnow()

class APIResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    meta: Meta | None = None
