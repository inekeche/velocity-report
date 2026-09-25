import React, { useState } from 'react';
import axios from 'axios';

// Automatically points to your live Render backend or falls back to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || import.meta.env?.VITE_API_URL || 'https://YOUR-BACKEND-SERVICE-NAME.onrender.com';

function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', company: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/signup`;
      const response = await axios.post(endpoint, formData);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      onLoginSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <button 
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: isLogin ? '2px solid #0284c7' : 'none', fontWeight: 'bold', color: isLogin ? '#0284c7' : '#64748b', cursor: 'pointer' }}
          >
            Login
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{ flex: 1, padding: '10px', background: 'none', border: 'none', borderBottom: !isLogin ? '2px solid #0284c7' : 'none', fontWeight: 'bold', color: !isLogin ? '#0284c7' : '#64748b', cursor: 'pointer' }}
          >
            Sign Up
          </button>
        </div>

        <h2 style={{ textAlign: 'center', color: '#0f172a', marginBottom: '20px' }}>
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {!isLogin && (
            <>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} placeholder="Enter your name" />
              </div>
              <div>
                <label style={labelStyle}>Company / Organization</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} style={inputStyle} placeholder="Enter company name" />
              </div>
            </>
          )}
          <div>
            <label style={labelStyle}>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} placeholder="name@company.com" />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} style={submitBtnStyle}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
      </div>
    </div>
  );
}

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', minHeight: '70vh' };
const cardStyle = { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px', border: '1px solid #e2e8f0' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '5px' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' };
const submitBtnStyle = { padding: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const errorStyle = { padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', textAlign: 'center' };

export default Auth;