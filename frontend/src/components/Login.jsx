import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // New states for API handling
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Call the Backend
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login Successful");
        
        // 2. Save the Security Token (CRITICAL STEP)
        localStorage.setItem('authToken', data.token);
        
        // Optional: Save user name if provided
        if(data.user) {
            localStorage.setItem('userInfo', JSON.stringify(data.user));
        }

        // 3. Redirect to Wedding Selector
        navigate('/weddings'); 
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error("Network Error:", err);
      setError('Server error. Is your backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>WMS</h2>
        
        {/* Error Message Display */}
        {error && <div style={{ color: 'red', marginBottom: '10px', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@example.com"
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
             {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        
        {/* Added missing link back to signup just in case */}
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'black', fontWeight: 'bold' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;