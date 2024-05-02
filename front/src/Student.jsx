import React, { useState, useEffect } from "react";
import axios from "axios";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3001/api/students/all"
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const studentData = {
      name: formData.get("name"),
      date_of_birth: formData.get("date_of_birth"),
      grade: formData.get("grade"),
      address: formData.get("address"),
      contact_number: formData.get("contact_number"),
    };

    try {
      await axios.post(
        "http://127.0.0.1:3001/api/students/create",
        studentData
      );
      setAlertInfo({
        show: true,
        message: "Student created successfully!",
        type: "success",
      });
      fetchStudents();
    } catch (error) {
      setAlertInfo({
        show: true,
        message: "Failed to create student",
        type: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3001/api/students/delete/${id}`);
      setAlertInfo({
        show: true,
        message: "Student deleted successfully!",
        type: "success",
      });
      fetchStudents();
    } catch (error) {
      setAlertInfo({
        show: true,
        message: "Failed to delete student",
        type: "error",
      });
    }
  };

  useEffect(() => {
    let timer;
    if (alertInfo.show) {
      timer = setTimeout(() => {
        setAlertInfo({ ...alertInfo, show: false });
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [alertInfo]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-bold mb-6">New Student</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">
            Enter the student name
          </label>
          <input
            type="text"
            name="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Select Grade</label>
          <select
            name="grade"
            className="shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={`Grade ${i + 1}`}>{`Grade ${
                i + 1
              }`}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Address</label>
          <input
            type="text"
            name="address"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Contact Number</label>
          <input
            type="tel"
            name="contact_number"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          Save
        </button>
      </form>
      {alertInfo.show && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-2 py-2 rounded text-white ${
            alertInfo.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {alertInfo.message}
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Students</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left">Name</th>
                <th className="px-2 py-2 text-left">Date of Birth</th>
                <th className="px-2 py-2 text-left">Grade</th>
                <th className="px-2 py-2 text-left">Address</th>
                <th className="px-2 py-2 text-left">Contact Number</th>
                <th className="px-2 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="m-2">
                  <td className="px-2 py-2 md:px-2 md:py-4">{student.name}</td>
                  <td className="px-2 py-2 md:px-2 md:py-4">{student.date_of_birth}</td>
                  <td className="px-2 py-2 md:px-2 md:py-4">{student.grade}</td>
                  <td className="px-2 py-2 md:px-2 md:py-4">{student.address}</td>
                  <td className="px-2 py-2 md:px-2 md:py-4">{student.contact_number}</td>
                  <td className="px-2 py-2 md:px-2 md:py-4">
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded focus:outline-none focus:shadow-outline transition-transform transform hover:translate-y-1 hover:shadow-lg"
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
    </div>
  );
};

export default Student;
