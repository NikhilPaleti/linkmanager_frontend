import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log(`http://localhost:5000/fetchuser/${localStorage.getItem('fp2_username')}`)
        const response = await fetch(`http://localhost:5000/fetchuser/${localStorage.getItem('fp2_username')}`);
        const data = await response.json()
        console.log(data.phoneno)
        if (response.ok) {
          setUsername(data.username);
          setEmail(data.email);
          setMobile(data.phoneno);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        toast.error(`Error fetching user data: ${error.message}`);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/edituser/${localStorage.getItem('fp2_username')}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, phoneno: mobile }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('User updated successfully!');
        localStorage.setItem('fp2_username', username)
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(`Update failed: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/deleteuser/${localStorage.getItem('fp2_username')}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Account deleted successfully!');
        localStorage.clear();
        window.location.href = '/';
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(`Delete failed: ${error.message}`);
    }
  };

  return (
    <div className="settings-container">
      <ToastContainer></ToastContainer>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile No" />
      <button onClick={handleUpdate}>Save Changes</button>
      <button style={{backgroundColor:'#ff0000'}} onClick={handleDelete}>Delete Account</button>
    </div>
  );
};

export default Settings;
