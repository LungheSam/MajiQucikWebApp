import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import '../index.css';
import MajiQuickLogo from '../assets/Majiquick_logo.svg';

function Login() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (loginError) {
      if (
        loginError.code === 'auth/invalid-credential' ||
        loginError.code === 'auth/wrong-password' ||
        loginError.code === 'auth/user-not-found'
      ) {
        setError('Incorrect email or password.');
      } else {
        setError(loginError.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img
        src={MajiQuickLogo}
        alt="MajiQuick Logo"
        className="login-logo"
      />

      <h2 className="form-title">Welcome Back</h2>

      <form onSubmit={handleLogin} className="form-group">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          required
        />

        {error ? <p className="auth-message auth-message-error">{error}</p> : null}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="auth-switch">
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
