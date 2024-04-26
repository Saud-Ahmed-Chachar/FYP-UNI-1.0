

  import React, { useState } from 'react';
  import { BrowserRouter as Router, Routes, Route, Link, Outlet, Navigate } from 'react-router-dom';
  import LoginPage from './components/Login';
  import { UniversityProvider } from './components/UniversityContext';
  import StudentsList from './components/StudentsList';


  // Sidebar component
  // Sidebar component
  const Sidebar = () => {
    return (
      <aside className="w-64 bg-blue-800 text-white p-6 fixed h-full"
      style={{
        background: 'linear-gradient(to right, rgb(36, 18, 101) 0%, rgb(0, 130, 203) 100%)',
        boxSizing: 'border-box'
      }}
    >

  <div className="flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-center my-4"> {/* Adjusted margin here */}
                    <div className="w-16 h-16 bg-gray-900 flex items-center justify-center rounded-full overflow-hidden">
                      <img 
                        src="https://th.bing.com/th/id/OIG3.N5G3Vo7taEPbYjB5I50s?pid=ImgGn" 
                        alt="Logo" 
                        className="h-full w-full object-cover" 
                        style={{ backgroundColor: 'transparent' }}
                      />
          
                    </div>
            
            </div>


            <div className="text-center mb-4">
                <h1 className="text-lg font-semibold">University Portal</h1>
              </div>
              <hr className="border border-gray-100" />

              <Link to="/logout" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500">Logout</Link>
        <nav className="mt-10">
          
        
          {/* <Link to="/students" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500">Applicants</Link> */}
         
        </nav>
        </div>
        </div>
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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    // Function to handle logout
    const handleLogout = () => {
      setIsLoggedIn(false);
    };
  
    return (
      <Router>
        <UniversityProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={isLoggedIn ? <Navigate to="/students" /> : <Navigate to="/login" />} />
              <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/students" element={<Layout><StudentsList /></Layout>} />
              <Route path="/logout" element={<Navigate to="/login" replace />} onNavigate={handleLogout} />
            </Routes>
          </div>
        </UniversityProvider>
      </Router>
    );
  };
  
  export default App;