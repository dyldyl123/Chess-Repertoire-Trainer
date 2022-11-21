from flask import Flask
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
# cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}},supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
db = SQLAlchemy(app)


from auth import auth_router
app.register_blueprint(auth_router)

import error_handlers