import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // <--- IMPORT THE CSS HERE

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in...");
    navigate('/'); 
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>WMS</h2>
        
        <form onSubmit={handleLogin}>
          {/* Email Field */}
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

          {/* Password Field */}
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

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;