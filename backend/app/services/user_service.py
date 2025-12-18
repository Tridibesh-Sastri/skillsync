from app.repositories.user_repository import UserRepository

class UserService:
    def __init__(self):
        self.repo = UserRepository()

    def create_user(self, name: str, email: str):
        return self.repo.create(name, email)

    def list_users(self):
        return self.repo.get_all()
