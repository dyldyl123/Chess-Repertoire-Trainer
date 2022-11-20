from flask import Blueprint, jsonify , request, session,abort
from models import User
from app import db
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
auth_router = Blueprint(__name__,'auth')

def login_required(fn):
    @wraps(fn)
    def check_login(*args, **kwargs):
        if not session.get('current_user', None):
            abort(403, 'Gotta log in bruh')
        return fn(*args, **kwargs)
    return check_login

@auth_router.route('/register/',methods = ['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    password_hash = generate_password_hash(str(password))
    user = User(username = username, password_hash = password_hash)
    db.session.add(user)
    db.session.commit()

    user_dict = user.to_dict()
    session['current_user'] = user_dict
    return jsonify({
        'success': 'success',
        'message': 'Successfully registered',
        'user': user_dict
    })


@auth_router.route('/logout/', methods=['POST'])
def logout():
    session.pop('current_user', None)
    return jsonify({
        'status': 'success',
        'message': 'Sucessfully logged out'
    })


@auth_router.route('/login/', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    user = User.query.filter_by(username=username).first()
    if not user: 
        abort(404, 'User not found')
    if not check_password_hash(user.password_hash,password):
        abort(403, 'Username and password don\'t match')

    user_dict = user.to_dict()
    session['current_user'] = user_dict
    return jsonify({
        'success': 'success',
        'message': 'Successfully registered',
        'user': user_dict
    })

@auth_router.route('/verify/', methods=['GET'])
def verify():
    current_user = session.get('current_user', None)
    if not current_user:
        abort(404, 'User not logged in or not found')
    return jsonify({
        'status': 'success',
        'message': 'User verified',
        'user': current_user
    })