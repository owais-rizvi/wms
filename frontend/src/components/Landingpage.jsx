import { Link } from 'react-router-dom';
import '../components/Login.css'; // Reusing your existing background styles

function LandingPage() {
    return (
        <div className="login-container"> {/* Uses the same blurred background */}
            
            <div className="landing-content" style={{ 
                textAlign: 'center', 
                background: 'rgba(255,255,255,0.95)', /* Slightly more opaque for readability */
                padding: '60px', 
                borderRadius: '20px', 
                maxWidth: '650px', 
                boxShadow: '0 20px 50px rgba(84, 12, 33, 0.15)', /* Burgundy tinted shadow */
                borderTop: '6px solid #540c21' /* Matching top accent */
            }}>
                
                {/* BRAND TITLE */}
                <h1 style={{ 
                    fontSize: '4rem', 
                    fontFamily: 'serif', 
                    marginBottom: '15px', 
                    color: '#540c21', /* Deep Burgundy */
                    fontWeight: '700',
                    letterSpacing: '-1px'
                }}>
                    Unionly
                </h1>
                
                {/* SUBTITLE */}
                <p style={{ 
                    fontSize: '1.25rem', 
                    color: '#555', 
                    marginBottom: '45px',
                    lineHeight: '1.6' 
                }}>
                    Plan your perfect wedding with ease. <br/>
                    Manage guests, budget, and vendors all in one place.
                </p>

                {/* BUTTONS */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    
                    {/* Log In Button (Outlined) */}
                    <Link to="/login">
                        <button style={{ 
                            padding: '16px 40px', 
                            fontSize: '1rem', 
                            background: 'transparent', 
                            color: '#540c21', /* Burgundy Text */
                            border: '2px solid #540c21', /* Burgundy Border */
                            borderRadius: '12px', 
                            cursor: 'pointer',
                            fontWeight: '700',
                            transition: 'all 0.2s ease',
                            minWidth: '160px'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#fff1f2'} /* Light rose hover */
                        onMouseOut={(e) => e.target.style.background = 'transparent'}
                        >
                            Log In
                        </button>
                    </Link>

                    {/* Get Started Button (Solid) */}
                    <Link to="/signup">
                        <button style={{ 
                            padding: '16px 40px', 
                            fontSize: '1rem', 
                            background: '#540c21', /* Burgundy Background */
                            color: 'white', 
                            border: '2px solid #540c21', 
                            borderRadius: '12px', 
                            cursor: 'pointer',
                            fontWeight: '700',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 15px rgba(84, 12, 33, 0.3)',
                            minWidth: '160px'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = '#370412'; /* Darker Burgundy */
                            e.target.style.borderColor = '#370412';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = '#540c21';
                            e.target.style.borderColor = '#540c21';
                            e.target.style.transform = 'translateY(0)';
                        }}
                        >
                            Get Started
                        </button>
                    </Link>

                </div>
            </div>
        </div>
    );
}

export default LandingPage;