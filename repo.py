from flask_sqlalchemy import SQLAlchemy
from model import User, db
from sqlalchemy import select

class UserRepo:
    def __init__(self, db: SQLAlchemy):
        self.db = db
    
    def get_by_id(self, id: int):
        return self.db.first_or_404(User.id == id)
    
    def get_by_username(self, username: str):
        return self.db.session.query(User.username == username).first()
    
    def create(self, username: str, password: str):
        user = User()
        user.username = username
        user.password = password
        db.session.add(user)
        db.session.commit()
        return user

USER = UserRepo(db)

