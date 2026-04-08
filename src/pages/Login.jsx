// src/pages/Login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import "../index.css";
import MajiQuickLogo from '../assets/Majiquick_logo.svg';

function Login() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [demoError, setDemoError] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  // If already logged in, redirect to home
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Handle eSignet callback
  useEffect(() => {
    const uid = searchParams.get('uid');
    const isNew = searchParams.get('isNew');
    
    if (uid) {
      console.log('✅ User authenticated via eSignet');
      // The AuthContext should pick up the user from Firebase
      // Redirect to home after a short delay
      setTimeout(() => {
        if (isNew === 'true') {
          alert('✅ Account created successfully! Welcome to MajiQuick.');
        }
        navigate('/');
      }, 500);
    }
  }, [searchParams, navigate]);

  // Handle eSignet login
  const handleESignetLogin = async () => {
    try {
      // Get the authorization URL from backend
      const response = await fetch('http://localhost:5000/auth/authorize-url');
      const data = await response.json();
      
      // Redirect to eSignet authorization endpoint
      window.location.href = data.authorizationUrl;
    } catch (error) {
      console.error('❌ Error initiating eSignet login:', error);
      alert('❌ Failed to initiate eSignet login. Please try again.');
    }
  };

  // Handle demo email/password login
  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setDemoError('');
    setDemoLoading(true);

    try {
      if (!email || !password) {
        setDemoError('Please enter email and password');
        setDemoLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      // Navigation happens automatically via useEffect
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        setDemoError('❌ User not found. Please register first.');
      } else if (error.code === 'auth/wrong-password') {
        setDemoError('❌ Wrong password.');
      } else {
        setDemoError(`❌ Login failed: ${error.message}`);
      }
    } finally {
      setDemoLoading(false);
    }
  };

  // Handle navigate to register
  const handleRegister = () => {
    navigate('/register-new');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Logo */}
        <img 
          src={MajiQuickLogo} 
          alt="MajiQuick Logo" 
          className="login-logo"
        />
        
        {/* Main eSignet Button */}
        <button
          onClick={handleESignetLogin}
          className="login-button esignet-button"
        >
          Sign In with eSignet
        </button>

        {/* Demo Login Section */}
        <div className="demo-section">
          <p className="demo-label">Demo Login (Development Only)</p>
          
          {showDemoForm ? (
            <form onSubmit={handleDemoLogin} className="demo-form">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="demo-input"
                disabled={demoLoading}
              />
              
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="demo-input"
                disabled={demoLoading}
              />

              {demoError && (
                <p className="demo-error">{demoError}</p>
              )}

              <button
                type="submit"
                className="demo-button demo-submit"
                disabled={demoLoading}
              >
                {demoLoading ? 'Logging in...' : 'Login'}
              </button>

              <button
                type="button"
                className="demo-button demo-cancel"
                onClick={() => setShowDemoForm(false)}
                disabled={demoLoading}
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="demo-buttons">
              <button
                onClick={() => setShowDemoForm(true)}
                className="demo-button demo-toggle"
              >
                Login with Email
              </button>

              <button
                onClick={handleRegister}
                className="demo-button demo-register"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
          padding: 20px;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        .login-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          max-width: 320px;
        }

        .login-logo {
          width: 200px;
          height: 200px;
          object-fit: contain;
          filter: drop-shadow(0 4px 12px rgba(0, 119, 255, 0.1));
        }

        .login-button {
          width: 100%;
          padding: 14px 20px;
          background: linear-gradient(135deg, #0077ff 0%, #00a8ff 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 8px 25px rgba(0, 119, 255, 0.15);
        }

        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(0, 119, 255, 0.25);
        }

        .login-button:active {
          transform: translateY(0);
        }

        .demo-section {
          width: 100%;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .demo-label {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .demo-buttons {
          display: flex;
          gap: 8px;
          flex-direction: column;
        }

        .demo-button {
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .demo-toggle {
          background: #f0f4ff;
          color: #0077ff;
          border: 1px solid #0077ff;
        }

        .demo-toggle:hover {
          background: #e6f0ff;
        }

        .demo-register {
          background: #f0f0f0;
          color: #333;
          border: 1px solid #ddd;
        }

        .demo-register:hover {
          background: #e8e8e8;
        }

        .demo-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .demo-input {
          padding: 11px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .demo-input:focus {
          outline: none;
          border-color: #0077ff;
          box-shadow: 0 0 0 3px rgba(0, 119, 255, 0.1);
        }

        .demo-input:disabled {
          background: #f5f5f5;
          color: #ccc;
        }

        .demo-error {
          color: #d32f2f;
          font-size: 12px;
          margin: 4px 0 0 0;
          text-align: center;
        }

        .demo-submit {
          background: linear-gradient(135deg, #0077ff 0%, #00a8ff 100%);
          color: white;
          margin-top: 4px;
        }

        .demo-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 119, 255, 0.2);
        }

        .demo-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .demo-cancel {
          background: #fff;
          color: #666;
          border: 1px solid #ddd;
        }

        .demo-cancel:hover:not(:disabled) {
          background: #f9f9f9;
        }

        .demo-cancel:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default Login;
