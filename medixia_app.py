from flask import Flask, render_template, request, jsonify
import json
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        name = data.get('name', '')
        email = data.get('email', '')
        phone = data.get('phone', '')
        message = data.get('message', '')
        
        # In a real application, you would save this to a database or send an email
        # For now, we'll just log it
        contact_data = {
            'name': name,
            'email': email,
            'phone': phone,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
        
        print(f"New contact form submission: {contact_data}")
        
        return jsonify({
            'success': True,
            'message': 'Thank you for contacting us! We will get back to you soon.'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred. Please try again.'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
