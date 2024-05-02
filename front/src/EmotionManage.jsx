import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmotionManage = () => {
  const [emotions, setEmotions] = useState([]);
  const [students, setStudents] = useState({}); // store student info here

  useEffect(() => {
   

    fetchEmotions();
  }, []);

  const fetchEmotions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3001/api/emotion/emotion_records/all');
      setEmotions(response.data);
    } catch (error) {
      console.error("Failed to fetch emotions:", error);
    }
  };

  useEffect(() => {
    const fetchStudentInfo = async () => {
      emotions.forEach(async (record) => {
        try {
          const response = await axios.get(`http://127.0.0.1:3001/api/students/get/${record.student.$oid}`);
          setStudents((prevStudents) => ({ ...prevStudents, [record.student.$oid]: response.data.name }));
        } catch (error) {
          console.error(`Failed to fetch student info for ${record.student.$oid}:`, error);
        }
      });
    };
  
    fetchStudentInfo();
  }, [emotions]);

  const deleteEmotionRecord = async (record) => {
    try {
      const recordId = record.$oid; // Extract the id property from the record object
      const response = await axios.delete(`http://127.0.0.1:3001/api/emotion/emotion_records/${recordId}`);
      setEmotions(emotions.filter((record) => record._id !== recordId));
      fetchEmotions();
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Emotion Records</h1>
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm text-left bg-blue-900 text-white">
          <thead className="text-xs bg-blue-700">
            <tr>
              <th scope="col" className="py-3 px-6">Date</th>
              <th scope="col" className="py-3 px-6">Student Name</th>
              <th scope="col" className="py-3 px-6">Emotion</th>
              <th scope="col" className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emotions.map((record) => (
              <tr key={record._id} className="bg-white border-b dark:bg-zinc-800 dark:border-zinc-700">
                <td className="py-4 px-6">{new Date(record.date.$date).toLocaleDateString()}</td>
                <td className="py-4 px-6">{students[record.student.$oid]}</td>
                <td className="py-4 px-6">{record.emotional_status}</td>
                <td className="py-4 px-6">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                    onClick={() => deleteEmotionRecord(record._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmotionManage;