from flask import Flask
import os
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
db = SQLAlchemy(app)



from toots import toots_router
from tooters import tooters_router
from auth import auth_router
app.register_blueprint(toots_router)
app.register_blueprint(tooters_router)
app.register_blueprint(auth_router)

import error_handlers