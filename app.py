from flask import Flask, render_template, jsonify
import json
import random
import os

app = Flask(__name__)

def load_questions():
    # This check helps find why the file might be missing
    if not os.path.exists('questions.json'):
        print("❌ ERROR: questions.json file not found in the main folder!")
        return []
    
    try:
        with open('questions.json', 'r') as f:
            data = json.load(f)
            print(f"✅ Successfully loaded {len(data)} questions.")
            return data
    except Exception as e:
        print(f"❌ ERROR reading JSON: {e}")
        return []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/questions')
def get_questions():
    all_q = load_questions()
    if not all_q:
        return jsonify({"error": "No questions found"}), 500
    
    # Randomly select 15 questions
    num_to_select = min(len(all_q), 15)
    selected = random.sample(all_q, num_to_select)
    return jsonify(selected)

if __name__ == '__main__':
    print("🚀 Starting Flask Server...")
    app.run(debug=True)