import { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('profileImage') || '/profile.jpg';
  });

  const updateProfileImage = (newImageBase64) => {
    setProfileImage(newImageBase64);
    localStorage.setItem('profileImage', newImageBase64);
  };

  return (
    <ProfileContext.Provider value={{ profileImage, updateProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};
