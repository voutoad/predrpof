from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import mapped_column, Mapped
from werkzeug.security import generate_password_hash

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True, index=True)
    password: Mapped[str]
    is_super_user: Mapped[bool] = mapped_column(default=False)

def check_password(user_password, password):
        return generate_password_hash(password) == user_password