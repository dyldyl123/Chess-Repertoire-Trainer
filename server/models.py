import datetime
from app import db


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable =False)
    toots = db.relationship('Toot', backref='user')
    


    def to_dict(self):
        return {
        'id' : self.id,
        'username': self.username,
        }


    def __repr__(self):
        return f'<User {self.id} - {self.username}>'

class Toot(db.Model):
    __tablename__ = 'toots'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime(timezone=True), default=datetime.datetime.now)
    platform = db.Column(db.String(20))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def to_dict(self):
        return {
            'id' : self.id,
            'text': self.text,
            'date': self.date,
            'platform': self.platform
        }

    def __repr__(self):
        return f'<Toot {self.id} - {self.platform}>'