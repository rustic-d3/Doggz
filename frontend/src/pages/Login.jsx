import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/forms.css'

export default function Login() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const goTo = ()=> navigate('/register')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");
      console.log("Server response:", data);
      localStorage.setItem("token", data.token)
      navigate(data.redirectUrl);
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error("Connection error:", error);
    alert("Could not connect to the server.");
  }
};

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          placeholder="Username"
          onChange={handleChange} 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password"
          onChange={handleChange} 
        />
        <button type="submit">Login</button>
        <button onClick={goTo} type="button">Register</button>
      </form>
    </div>
  );
}