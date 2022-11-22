from flask import Blueprint, jsonify , request, session,abort
from models import User, Position, Outstanding, Card
from app import db
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from merge import combinePGN
import datetime

auth_router = Blueprint(__name__,'auth')

def login_required(fn):
    @wraps(fn)
    def check_login(*args, **kwargs):
        print(session.keys())
        if not session.get('current_user', None):
            abort(403, 'Gotta log in bruh')
        return fn(*args, **kwargs)
    return check_login

@auth_router.route('/api/register/',methods = ['POST'])
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


@auth_router.route('/api/logout/', methods=['POST'])
def logout():
    session.pop('current_user', None)
    return jsonify({
        'status': 'success',
        'message': 'Sucessfully logged out'
    })


@auth_router.route('/api/login/', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    user = User.query.filter_by(username=username).first()
    print(user)
    if not user: 
        abort(404, 'User not found')
    if not check_password_hash(user.password_hash,password):
        abort(403, 'Username and password don\'t match')

    user_dict = user.to_dict()
    session['current_user'] = user_dict
    return jsonify({
        'success': 'success',
        'message': 'Successfully Logged in',
        'user': user_dict
    })

@auth_router.route('/api/verify/', methods=['GET'])
def verify():
    current_user = session.get('current_user', None)
    if not current_user:
        abort(404, 'User not logged in or not found')
    return jsonify({
        'status': 'success',
        'message': 'User verified',
        'user': current_user
    })



@auth_router.route('/api/position/<position_id>', methods=['PUT'])
@login_required
def update_position(position_id):
    position_data = request.get_json()
    current_user = session.get('current_user')
    position = Position.query.get_or_404(position_id, 'Position Not Found')

    if position.user_id != current_user['id']:
        abort(403,"You don't own this position")
    
    for key, value in position_data.items():
        setattr(position,key,value)

    position.user_id = current_user['id']


    db.session.add(position)
    db.session.commit()
    return jsonify(position.to_dict())


@auth_router.route('/api/position/', methods=['POST'])
@login_required
def create_position():

    #preparing to write to db
    position_data = request.get_json()
    current_user = session.get('current_user')
    position = Position(**position_data, user_id = current_user['id'])

    #checking if position is already in the db for the user
    position_to_compare = Position.query.filter(Position.user_id == current_user['id']).all()
    position_pgn_to_compare = [position.pgn for position in position_to_compare]
    exists = position_pgn_to_compare.count(position.pgn)
    if exists > 0:
        return jsonify({
        'status': 'error',
        'message': 'Position Already Exists for this user',
    }) 

    #writing to db
    db.session.add(position)
    db.session.commit()

    # get position that we just published to db

    our_new_position = Position.query.filter((Position.user_id == current_user['id']) & (Position.pgn == position.pgn) ).all()
    # card needs to contain id , fen , position id user id , colour 

    card = Card(position_id = our_new_position[0].id , fen = our_new_position[0].pgn, colour = our_new_position[0].colour , user_id = our_new_position[0].user_id)

    #create Card
    db.session.add(card)
    db.session.commit()

    #pull card from db

    our_new_card = Card.query.filter((Card.user_id == current_user['id']) & (Card.position_id == position.id)).all()
    #create outstanding 

    outstanding = Outstanding(card_id = our_new_card[0].id, user_id = current_user['id'])

   

    db.session.add(outstanding)
    db.session.commit()
    return jsonify(position.to_dict())

@auth_router.route('/api/outstanding/<user_id>', methods=['GET'])
@login_required
def pull_queue(user_id):
    outstanding_cards = Outstanding.query.filter((Outstanding.user_id == user_id) & (Outstanding.queue_time <= datetime.datetime.now())).all()

    outstanding_cards_dicts = [outstanding_card.to_dict() for outstanding_card in outstanding_cards]

    position_list = []
    for card in outstanding_cards:
        position = Card.query.get(card.card_id)
        position_list.append(position)
    print(position_list)

    position_list_dicts = [position_card.to_dict() for position_card in position_list]
    return jsonify(position_list_dicts)

@auth_router.route('/api/positions/<user_id>', methods=['GET'])
@login_required
def get_positions(user_id):
    positions = Position.query.filter(Position.user_id == user_id).all()
    position_dicts = [position.to_dict() for position in positions]
    pgns = [position.pgn for position in positions]
    output = combinePGN(pgns)
    
    return jsonify(position_dicts)



@auth_router.route('/api/mergepositions/<user_id>', methods=['GET'])
@login_required
def merge_positions(user_id):
    positions = Position.query.filter(Position.user_id == user_id).all()
    # position_dicts = [position.to_dict() for position in positions]
    pgns = [position.pgn for position in positions]
    output = combinePGN(pgns)
    output2 = str(output)
    return jsonify(output2)


