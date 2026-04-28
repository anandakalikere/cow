from flask import Flask, jsonify, request
import json

app = Flask(__name__)

# Load skills data from JSON file
def load_skills():
    with open('data/skills.json') as f:
        return json.load(f)

@app.route('/api/skills', methods=['GET'])
def get_skills():
    skills = load_skills()
    return jsonify(skills)

@app.route('/api/analyze', methods=['POST'])
def analyze_skills():
    data = request.json
    user_skills = data.get('skills', [])
    skills_data = load_skills()

    # Simple analysis logic to find gaps
    skill_gaps = [skill for skill in skills_data if skill not in user_skills]
    
    return jsonify({'gaps': skill_gaps})

if __name__ == '__main__':
    app.run(debug=True)