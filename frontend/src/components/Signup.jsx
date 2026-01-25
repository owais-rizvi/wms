import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  
  // New states for API handling
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // 1. Client-side validation
    if (password !== confirmPass) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // 2. Call the Backend
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We map 'fullName' to 'name' because that is what servers usually expect
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Signup successful");
        navigate('/login');
      } else {
        // Show error from backend (e.g., "Email already in use")
        setError(data.message || 'Signup failed');
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
        <h2>Create Account</h2>
        
        {/* Error Message Display */}
        {error && <div style={{ color: 'red', marginBottom: '10px', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSignup}>
          
          <div className="form-group">
            <label>First Name</label>
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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Already have an account? <Link to="/login" style={{ color: 'black', fontWeight: 'bold' }}>Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;