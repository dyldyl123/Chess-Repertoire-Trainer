from flask import jsonify
from app import app # define error handlers on the app level

@app.errorhandler(404)
def handle_404(e): ## returns tuple of return value / error code
    return jsonify({
        'status': 'error',
        'message': e.description
    }), 404

@app.errorhandler(403)
def handle_403(e): ## returns tuple of return value / error code
    return jsonify({
        'status': 'error',
        'message': e.description
    }), 403