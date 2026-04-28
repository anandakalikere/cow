# Skill Gap Analyzer for Students

## Overview
The Skill Gap Analyzer for Students is a full-stack web application designed to help students identify and analyze their skill gaps in various subjects. The application consists of a frontend built with React and a backend powered by Flask.

## Project Structure
```
skill-gap-analyzer
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── components
│   │   │   └── App.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend
│   ├── app.py
│   ├── requirements.txt
│   └── data
│       └── skills.json
└── README.md
```

## Technologies Used
- **Frontend**: React, HTML, CSS, JavaScript
- **Backend**: Python, Flask
- **Database**: JSON dataset (skills.json)

## Setup Instructions

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

### Backend
1. Navigate to the `backend` directory.
2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Run the Flask application:
   ```
   python app.py
   ```

## Usage
- Access the frontend application at `http://localhost:3000`.
- The backend API can be accessed at `http://localhost:5000`.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.