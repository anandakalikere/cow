import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [analysisResult, setAnalysisResult] = useState(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axios.get('/api/skills');
                setSkills(response.data);
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };

        fetchSkills();
    }, []);

    const handleSkillSelect = (skill) => {
        setSelectedSkills((prev) => 
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const analyzeSkills = async () => {
        try {
            const response = await axios.post('/api/analyze', { skills: selectedSkills });
            setAnalysisResult(response.data);
        } catch (error) {
            console.error('Error analyzing skills:', error);
        }
    };

    return (
        <div>
            <h1>Skill Gap Analyzer for Students</h1>
            <h2>Select Skills:</h2>
            <ul>
                {skills.map(skill => (
                    <li key={skill} onClick={() => handleSkillSelect(skill)}>
                        {skill} {selectedSkills.includes(skill) ? '✓' : ''}
                    </li>
                ))}
            </ul>
            <button onClick={analyzeSkills}>Analyze Skills</button>
            {analysisResult && (
                <div>
                    <h2>Analysis Result:</h2>
                    <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default App;