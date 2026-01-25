import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Login.css';

function WeddingSelector() {
    const navigate = useNavigate();
    
    // --- State ---
    const [weddings, setWeddings] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newWedding, setNewWedding] = useState({ title: '', startDate: '' });
    
    // UI State
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- 1. Load Weddings from Backend on Startup ---
    useEffect(() => {
        const fetchWeddings = async () => {
            try {
                // Call Backend with cookies
                const response = await fetch('http://localhost:3000/api/weddings', {
                    credentials: 'include' // Send cookies
                });

                if (response.ok) {
                    const data = await response.json();
                    setWeddings(data);
                } else if (response.status === 401) {
                    // Not authenticated, redirect to login
                    navigate('/login');
                    return;
                } else {
                    setError('Failed to load weddings.');
                }
            } catch (err) {
                console.error(err);
                setError('Could not connect to server.');
            } finally {
                setLoading(false);
            }
        };

        fetchWeddings();
    }, [navigate]);

    // --- 2. Handle Entering a Wedding ---
    const handleSelectWedding = (wedding) => {
        // We still save the *Active* wedding to LocalStorage so the Sidebar can read it easily
        localStorage.setItem("activeWedding", JSON.stringify(wedding));
        navigate('/dashboard'); 
    };

    // --- 3. Handle Creating a Wedding (Backend) ---
    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/weddings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Send cookies
                body: JSON.stringify(newWedding) // Send names & date
            });

            const data = await response.json();

            if (response.ok) {
                // Backend returns the created wedding object (with a real ID)
                const createdWedding = data;
                
                // Update list locally
                setWeddings([...weddings, createdWedding]);
                
                // Select it immediately
                handleSelectWedding(createdWedding);
            } else {
                setError(data.message || 'Failed to create wedding');
            }
        } catch (err) {
            setError('Server error. Is the backend running?');
        }
    };

    // --- Render ---
    if (loading) return <div style={{textAlign:'center', marginTop: '50px'}}>Loading your weddings...</div>;

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '500px' }}>
                
                {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

                {/* Show Create Form if (User clicked Create) OR (List is Empty) */}
                {isCreating || weddings.length === 0 ? (
                    <div>
                        <h2>Create New Wedding</h2>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Couple Names</label>
                                <input 
                                    type="text" 
                                    placeholder="Sarah & John" 
                                    value={newWedding.title} 
                                    onChange={(e) => setNewWedding({...newWedding, title: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Wedding Date</label>
                                <input 
                                    type="date" 
                                    value={newWedding.startDate} 
                                    onChange={(e) => setNewWedding({...newWedding, startDate: e.target.value})} 
                                    required 
                                />
                            </div>
                            <button type="submit" className="login-btn">Start Planning</button>
                            
                            {/* Cancel Button (Only if you have other weddings to go back to) */}
                            {weddings.length > 0 && (
                                <button 
                                    type="button" 
                                    onClick={() => setIsCreating(false)}
                                    style={{ marginTop: '15px', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: '#666', width: '100%' }}
                                >
                                    Cancel & Go Back
                                </button>
                            )}
                        </form>
                    </div>
                ) : (
                    /* Existing Weddings List */
                    <div>
                        <h2>Your Weddings</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
                            {weddings.map(w => (
                                <button 
                                    key={w._id || w.id} // Use MongoDB _id or fallback to id
                                    onClick={() => handleSelectWedding(w)} 
                                    style={{ padding: '15px', border: '1px solid #ddd', background: 'white', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}
                                >
                                    <strong>{w.title}</strong> <br/>
                                    <span style={{ fontSize: '0.85rem', color: '#666' }}>
                                        {w.startDate ? new Date(w.startDate).toLocaleDateString() : 'No date set'}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <button className="login-btn" onClick={() => setIsCreating(true)}>
                            + Add Another Wedding
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WeddingSelector;