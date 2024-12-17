from flask import Flask, render_template, request, redirect
from werkzeug.security import generate_password_hash
import ast
from repo import USER
from model import *
from flask_login import LoginManager, login_user, login_required, logout_user

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///project.db'
login_manager = LoginManager(app)
db.init_app(app)

@login_manager.user_loader
def user_loader(id):
    return USER.get_by_id(id)

@app.get('/login')
def login_get():
    return render_template('login.html')


@app.post('/api/login/')
def login_post():
    data = ast.literal_eval(request.data.decode())
    user = USER.get_by_username(data['username'])
    print(type(user))
    if user and check_password(user.password, data['password']):
        login_user(user)
        return {'is_super_user': user.is_super_user}
    return {"result": 'wrong data'}


@app.get('/register')
def register_get():
    return render_template('register.html')


@app.post('/api/register/')
def register_post():
    data = ast.literal_eval(request.data.decode())
    data['password'] = generate_password_hash(data['password'])
    USER.create(**data)
    return {'result': 'success'}


@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/user')
def user():
    return render_template('user.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run()