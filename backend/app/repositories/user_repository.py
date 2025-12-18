from typing import Dict
from uuid import UUID, uuid4
from datetime import datetime
from app.models.user import User

class UserRepository:
    def __init__(self):
        self._users: Dict[UUID, User] = {}

    def create(self, name: str, email: str) -> User:
        user = User(
            id=uuid4(),
            name=name,
            email=email,
            created_at=datetime.utcnow()
        )
        self._users[user.id] = user
        return user

    def get_all(self):
        return list(self._users.values())
