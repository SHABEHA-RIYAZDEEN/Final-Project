import React, { useState, useEffect } from 'react';
import Camera from './WebCamera';
import axios from 'axios';

const EmotionRecognition = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [emotion, setEmotion] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3001/api/students/all');
        setStudents(response.data);
      } catch (err) {
        setError('Failed to fetch students');
        setTimeout(() => setError(null), 5000);
      }
    };
    fetchStudents();
  }, []);

  const handleResponse = async (names) => {
    if (names.length === 0 || !names[0].emotion) {
      setError("No valid emotion detected");
      setTimeout(() => setError(null), 5000);
      return;
    }
    const mostOccurred = mode(names);
    const emotionDetected = mostOccurred.emotion[0];
    setEmotion(emotionDetected);
  };

  const saveEmotionRecord = async () => {
    if (!selectedStudent || !emotion) {
      setError("Please select a student and ensure an emotion is detected.");
      setTimeout(() => setError(null), 5000);
      return;
    }
    try {
      await axios.post('http://127.0.0.1:3001/api/emotion/emotion_records', {
        student_id: selectedStudent,
        date: new Date().toISOString().slice(0, 10),
        emotional_status: emotion
      });
      setSuccessMessage('Emotion recorded successfully');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to record emotion");
      setTimeout(() => setError(null), 5000);
    }
  };

  const mode = arr =>
    arr.reduce(
      (acc, val) => (
        acc[val] ? acc[val]++ : acc[val] = 1,
        acc.max < acc[val] && (acc.max = acc[val], acc.mode = val),
        acc
      ),
      { max: 0 }
    ).mode;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl font-semibold mb-6">Position your face within the frame</h2>
      {successMessage && (
            <div className="mt-6">
              <p className="text-lg text-green-500">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="fixed top-5 z-100 w-full text-center">
              <div className="mx-auto p-4 bg-red-500 text-white max-w-lg">
                {error}
              </div>
            </div>
          )}
          {emotion && (
            <div className="my-6">
              <p className="text-xl font-semibold ">Emotion Detected: {emotion}</p>
            </div>
          )}
      <div className="grid grid-cols-2 gap-6 items-start">
        
        <div>
          <Camera endpointUrl="http://127.0.0.1:3001/api/ml/predict" numImages={1} onResponse={handleResponse} />
        </div>
        

        <div className="grid grid-cols-2 gap-6 items-start">
          {students.length > 0 && (
            <select 
              className="mt-4 mb-4 text-lg rounded border-gray-300 shadow-sm"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Select a student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          )}

         

          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={saveEmotionRecord}
          >
            Record Emotion
          </button>

         
        </div>
      </div>
    </div>
  );
};

export default EmotionRecognition;
