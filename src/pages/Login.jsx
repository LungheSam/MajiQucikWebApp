// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import "../index.css";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('✅ Login successful!');
      navigate('/'); // Or wherever the user should go after login
    } catch (error) {
      alert('❌ Login failed: ' + error.message);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="form-title">Login to MajiQuick</h2>
      <form onSubmit={handleLogin} className="form-group">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type='submit' className="login-button" disabled={loading}>
        {loading ? 'Logging In…' : 'Login'}
        </button>
      </form>

      <p> 
        Don't have an account? <Link to="/register-new">Register</Link>
      </p>
    </div>
  );
}

export default Login;
