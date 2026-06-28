import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProfilePage() {
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("https://via.placeholder.com/150"); // Default avatar sample
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      // If manager session exists without custom values, set standard sample display fallbacks
      const isManager = stored.role === 'manager' || stored.username !== 'admin';
      
      setDisplayName(stored.name || stored.fullName || (isManager ? "Shaba Manager" : "abdisalam mohamed"));
      setEmail(stored.email || (isManager ? "manager@shaaba.com" : "abdisalam@gmail.com"));
      if (stored.avatar) setAvatar(stored.avatar);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Save as base64 string for instant preview & local storage persistence
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    if (e) e.preventDefault();
    try {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...stored, name: displayName, fullName: displayName, email: email, avatar: avatar };
      
      // Save directly to localStorage for instant UI responsiveness
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('userFullName', displayName);
      localStorage.setItem('userEmail', email);
      
      // Backend API sync based on role
      const role = localStorage.getItem('role') || stored.role || 'admin';
      if (role === 'manager') {
        const payload = { fullName: displayName, email: email };
        const userId = stored.id || stored._id;
        if (userId) {
          await axios.put(`http://localhost:5000/api/managers/${userId}`, payload).catch(() => null);
        }
      } else {
        const payload = { name: displayName, email: email };
        await axios.put('http://localhost:5000/api/admin/profile', payload).catch(() => null);
      }
      
      // Fire global storage update notification event to update Navbar/Sidebar instantly
      window.dispatchEvent(new Event("storage_profile_updated"));
      
      setStatusMessage("Profile updated successfully!");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>My Profile</h2>
        <button 
          onClick={() => navigate('/')} 
          style={{ color: '#059669', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', gap: '40px', alignItems: 'center', border: '1px solid #f1f5f9' }}>
        
        <div style={{ textAlign: 'center' }}>
          <img 
            src={avatar} 
            alt="Profile Preview" 
            style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e5e7eb', marginBottom: '15px' }}
          />
          <div>
            <label style={{ backgroundColor: '#059669', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', display: 'inline-block', fontWeight: '500' }}>
              Upload New
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
          {avatar !== "https://via.placeholder.com/150" && (
            <button onClick={() => setAvatar("https://via.placeholder.com/150")} style={{ background: 'none', border: 'none', color: '#ef4444', marginTop: '10px', cursor: 'pointer', fontSize: '13px' }}>
              Remove
            </button>
          )}
        </div>

        <form onSubmit={handleUpdateProfile} style={{ flex: 1 }}>
          {statusMessage && (
            <div style={{ background: '#d1fae5', color: '#065f46', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>
              {statusMessage}
            </div>
          )}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Display Name</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} required />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} required />
          </div>
          <button type="submit" style={{ background: '#059669', color: '#fff', padding: '10px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '15px' }}>
            Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
}
