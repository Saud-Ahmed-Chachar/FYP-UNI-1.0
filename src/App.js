

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';
import LoginPage from './components/Login';
import UniversitiesList from './components/UniversitiesList';
import StudentsList from './components/StudentsList';
import Dashboard from './components/Dashboard';
import ScholarshipList from './components/ScholarshipList';
import { UniversityProvider } from './components/UniversityContext'; 

// Sidebar component
// Sidebar component
const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-6 fixed h-full">
      <nav className="mt-10">
        {/* <Link to="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Dashboard</Link> */}
        {/* <Link to="/universities" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">University List</Link> */}
        <Link to="/students" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Applicants</Link>
        {/* <Link to="/scholarships" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Scholarship List</Link> */}
        <Link to="/logout" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Logout</Link>
      </nav>
    </aside>
  );
};


// Layout component that includes the Sidebar and an Outlet for nested routes

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-10 ml-64"> {/* Add ml-64 to shift content right */}
        {children}
      </div>
    </div>
  );
};



// Main application component with routing setup
const App = () => {
  // State to track login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  

  // Function to handle logout
  const handleLogout = () => {
    // Perform logout logic here
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}>
          {/* Redirect to login or dashboard based on login status */}
        </Route>
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        {/* <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} /> */}
        {/* <Route path="/universities" element={<Layout><UniversitiesList /></Layout>} /> */}
        <Route path="/students" element={<Layout><StudentsList /></Layout>} />
        {/* <Route path="/scholarships" element={<Layout><ScholarshipList /></Layout>} /> */}
        <Route path="/logout" element={<Navigate to="/login" replace />} />
        {/* Add more main routes if needed */}
      </Routes>
    </Router>
  );
};

export default App;
