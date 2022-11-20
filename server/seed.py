from datetime import date
from app import app, db
from models import User, Folder, Card, Outstanding, ScoreHistory

with app.app_context():
    db.drop_all()
    db.create_all()