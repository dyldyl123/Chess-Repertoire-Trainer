import datetime
from app import db


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable =False)
    folders = db.relationship('Folder', backref='user')

    


    def to_dict(self):
        return {
        'id' : self.id,
        'username': self.username,
        }


    def __repr__(self):
        return f'<User {self.id} - {self.username}>'

class Folder(db.Model):
    __tablename__ = 'folder'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    date_created = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now)
    pgn = db.Column(db.Text)
    folder_parent = db.Column(db.Integer)
    folder_child = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def to_dict(self):
        return {
            'id' : self.id,
            'title': self.title,
            'pgn': self.pgn,
            'date_created': self.date_created,
            'user_id': self.user_id,
            'folder_parent': self.folder_parent,
            'folder_child': self.folder_child,
            'user_id': self.user_id
        }

    def __repr__(self):
        return f'<Folder {self.id} - {self.title}>'


class Position(db.Model):
    __tablename__ = 'position'
    id = db.Column(db.Integer, primary_key = True)
    fen = db.Column(db.Text)
    pgn = db.Column(db.Text)
    comment = db.Column(db.Text)
    colour = db.Column(db.Boolean)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def to_dict(self):
        return {
        'id' : self.id,
        'fen': self.fen,
        'pgn': self.pgn,
        'comment': self.comment,
        'user_id': self.user_id,
        'colour': self.colour,
        
    }

    def __repr__(self):
        return f'<Position {self.id} - {self.pgn}>'


class Card(db.Model):
    __tablename__ = 'card'
    id = db.Column(db.Integer, primary_key = True)
    fen = db.Column(db.Text)
    position_id = db.Column(db.Integer, db.ForeignKey('position.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    colour = db.Column(db.Text)

    def to_dict(self):
        return {
        'id' : self.id,
        'fen': self.fen,
        'position_id': self.position_id,
        'user_id': self.user_id,
        'colour': self.colour,
    }

    def __repr__(self):
        return f'<Card {self.id} - {self.position_id}>'

class Outstanding(db.Model):
    __tablename__ = 'outstanding'
    id = db.Column(db.Integer, primary_key = True)
    queue_time = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now)
    card_id = db.Column(db.Integer, db.ForeignKey('card.id'))
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'))

    def to_dict(self):
        return {
        'id' : self.id,
        'queue_time': self.queue_time,
        'card_id': self.card_id,
        'user_id': self.user_id,
    }

    def __repr__(self):
        return f'<Outstanding {self.id} - {self.card_id} - {self.queue_time}>'


class ScoreHistory(db.Model):
    __tablename__ = 'score_history'
    id = db.Column(db.Integer, primary_key = True)
    score = db.Column(db.Integer)
    card_id = db.Column(db.Integer, db.ForeignKey('card.id'))
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'))

    def to_dict(self):
        return {
        'id' : self.id,
        'score': self.score,
        'card_id': self.card_id,
        'user_id': self.user_id,
    }

    def __repr__(self):
        return f'<ScoreHistory {self.id} - {self.card_id} - {self.user_id} - {self.score}>'