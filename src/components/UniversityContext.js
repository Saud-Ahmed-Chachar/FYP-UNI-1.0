import React, { createContext, useContext, useState, useEffect } from 'react';

const UniversityContext = createContext();

export const useUniversity = () => useContext(UniversityContext);

export const UniversityProvider = ({ children }) => {
  const [universityUrl, setUniversityUrl] = useState('');

  // Attempt to load the universityUrl from localStorage when the component mounts
  useEffect(() => {
    const storedUrl = localStorage.getItem('universityUrl');
    if (storedUrl) {
      setUniversityUrl(storedUrl);
    }
  }, []);

  // Update localStorage whenever universityUrl changes
  useEffect(() => {
    if (universityUrl) {
      localStorage.setItem('universityUrl', universityUrl);
    }
  }, [universityUrl]);

  return (
    <UniversityContext.Provider value={{ universityUrl, setUniversityUrl }}>
      {children}
    </UniversityContext.Provider>
  );
};
