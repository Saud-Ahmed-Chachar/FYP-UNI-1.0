

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [universityUrl, setUniversityUrl] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    // Check if the credentials match the expected values
    const dataToPass = { universityUrl: universityUrl };
    console.log(universityUrl, password);
    
      navigate('/students',{state:dataToPass});
      // alert('Invalid university URL or password');
    
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <form onSubmit={handleLogin} className="divide-y divide-gray-200">
              <div className="text-center">
                <h1 className="text-2xl font-semibold sm:text-3xl">Login</h1>
              </div>
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <input
                  id="universityUrl"
                  name="universityUrl"
                  type="text"
                  required
                  className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600"
                  placeholder="University URL"
                  value={universityUrl}
                  onChange={(e) => setUniversityUrl(e.target.value)}
                />
                <label htmlFor="universityUrl" className="peer-placeholder-shown:text-gray-400 transition-all">
                  University URL
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password" className="peer-placeholder-shown:text-gray-400 transition-all">
                  Password
                </label>
                <div className="flex justify-center mt-6">
                  <button type="submit" className="bg-cyan-500 text-white rounded-md px-4 py-2 w-full transform hover:scale-105 transition-transform">
                    Login
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;