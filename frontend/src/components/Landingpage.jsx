import { Link } from 'react-router-dom';
import '../components/Login.css'; // Reusing your existing background styles

function LandingPage() {
    return (
        <div className="login-container"> {/* This gives the heart background */}
            <div className="landing-content" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.9)', padding: '50px', borderRadius: '15px', maxWidth: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                
                <h1 style={{ fontSize: '3.5rem', fontFamily: 'Playfair Display, serif', marginBottom: '10px', color: '#1a1a1a' }}>Unionly</h1>
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>
                    Plan your perfect wedding with ease. Manage guests, budget, and vendors all in one place.
                </p>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    
                    {/* Login Button */}
                    <Link to="/login">
                        <button style={{ 
                            padding: '15px 40px', 
                            fontSize: '1rem', 
                            background: 'white', 
                            border: '2px solid black', 
                            borderRadius: '30px', 
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: '0.3s'
                        }}>
                            Log In
                        </button>
                    </Link>

                    {/* Signup Button */}
                    <Link to="/signup">
                        <button style={{ 
                            padding: '15px 40px', 
                            fontSize: '1rem', 
                            background: 'black', 
                            color: 'white', 
                            border: '2px solid black', 
                            borderRadius: '30px', 
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}>
                            Get Started
                        </button>
                    </Link>

                </div>
            </div>
        </div>
    );
}

export default LandingPage;