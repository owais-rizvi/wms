import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // <--- REUSING YOUR EXISTING CSS

function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    
    if (password !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Creating account for:", fullName);
    // Future: Add backend registration logic here
    navigate('/'); 
  };

  return (
    <div className="login-container">
      {/* Reusing 'login-card' class makes it look identical */}
      <div className="login-card">
        <h2>Create Account</h2>
        
        <form onSubmit={handleSignup}>
          
          {/* New Field: Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Sarah & John"
              required 
            />
          </div>

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
              placeholder="Create a password"
              required 
            />
          </div>

          {/* New Field: Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Repeat password"
              required 
            />
          </div>

          <button type="submit" className="login-btn">
            Sign Up
          </button>

          {/* Link to switch back to Login */}
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Already have an account? <Link to="/login" style={{ color: 'black', fontWeight: 'bold' }}>Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;