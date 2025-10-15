// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  // Basic validations
  if (!name || !phone || !email || !password || !confirmPassword) {
    alert('❌ All fields are required');
    return;
  }

  // Password length
  if (password.length < 6) {
    alert('❌ Password must be at least 6 characters');
    return;
  }

  // Password match
  if (password !== confirmPassword) {
    alert('❌ Passwords do not match');
    return;
  }

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('❌ Enter a valid email address');
    return;
  }

  // Phone number format (basic: digits only, at least 10 digits)
  const phoneRegex = /^\d{10,15}$/;
  if (!phoneRegex.test(phone)) {
    alert('❌ Enter a valid phone number (at least 10 digits)');
    return;
  }

  try {
    const response = await fetch('https://majiquickserver.onrender.com/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, password, confirmPassword }),
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
      localStorage.setItem('registrationData', JSON.stringify({ name, phone, email, password }));
      navigate('/verify');
    } else {
      alert('❌ Failed to send verification');
    }
  } catch (error) {
    alert('Server error: ' + error.message);
  }
  finally{
    setLoading(false);
  }
};


  return (
    <div className="register-container">
      <h2>Create Your MajiQuick Account</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        <button type='submit' className="login-button" disabled={loading}>
        {loading ? 'Registering…' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
