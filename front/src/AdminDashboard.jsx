import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faSignOutAlt, faBars, faSmile, faCogs } from '@fortawesome/free-solid-svg-icons'; // Added faTrain icon
import Student from './Student';
import EmotionManage from './EmotionManage';
import Train from './Train'; // Imported Train component

function AdminDashboard() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Timer to automatically resize the side panel after 5 seconds
    useEffect(() => {
        let timer;
        if (isMenuOpen) {
            timer = setTimeout(() => {
                setMenuOpen(false);
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [isMenuOpen]);

    const logout = () => {
        localStorage.setItem('login', 'false');
        setMenuOpen(false);
    }

    useEffect(() => {
        const result = localStorage.getItem('login');
        if (result !== 'true') {
            navigate('/');
        }
    }, []);

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Responsive Mobile Menu Button */}
            <div className="text-black md:hidden">
                <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-4">
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>

            {/* Side Panel - Conditionally rendered based on screen size */}
            <div className={`bg-blue-900 text-white w-64 absolute inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-300`}>
                <div className="p-4 text-xl font-bold">Admin Panel</div>
                <div className="border-t border-gray-700"></div>
                <ul className="py-4">
                    <li className="px-4 py-2 hover:bg-gray-700">
                        <Link to="student" onClick={() => setMenuOpen(false)}>
                            <FontAwesomeIcon icon={faUsers} className="mr-2" />
                            Students
                        </Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-700">
                        <Link to="emotion" onClick={() => setMenuOpen(false)}>
                            <FontAwesomeIcon icon={faSmile} className="mr-2" />
                            Emotions
                        </Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-700"> {/* Added Train item */}
                        <Link to="train" onClick={() => setMenuOpen(false)}>
                            <FontAwesomeIcon icon={faCogs} className="mr-2" />
                            Train
                        </Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-700">
                        <Link to="/" onClick={logout}>
                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                            Logout
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-4 overflow-auto">
                <Routes>
                    <Route index element={<Student />} />
                    <Route path="student" element={<Student />} />
                    <Route path="emotion" element={<EmotionManage />} />
                    <Route path="train" element={<Train />} /> {/* Added Train route */}
                </Routes>
            </div>
        </div>
    );
}

export default AdminDashboard;
