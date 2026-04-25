import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!name || !phone || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setError('Enter a valid phone number with 10 to 15 digits.');
      return;
    }

    setLoading(true);

    try {
      const credentials = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(credentials.user, {
        displayName: name,
      });

      await setDoc(doc(db, 'users', credentials.user.uid), {
        name,
        phone,
        email,
        createdAt: serverTimestamp(),
      });

      navigate('/');
    } catch (registerError) {
      if (registerError.code === 'auth/email-already-in-use') {
        setError('That email is already registered. Please log in instead.');
      } else {
        setError(registerError.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create Your MajiQuick Account</h2>

      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={loading}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          disabled={loading}
          required
        />

        <input
          type="email"
          placeholder="Email"
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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          disabled={loading}
          required
        />

        {error ? <p className="auth-message auth-message-error">{error}</p> : null}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
