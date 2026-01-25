import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Login.css';

function WeddingSelector() {
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);
    
    // Default list (can be empty [])
    const [weddings, setWeddings] = useState([]);
    const [newWedding, setNewWedding] = useState({ names: '', date: '' });

    // --- UPDATED FUNCTION ---
    const handleSelectWedding = (wedding) => {
        // Save the specific wedding details to LocalStorage
        const weddingData = {
            id: wedding.id,
            names: wedding.names,
            date: wedding.date
        };
        localStorage.setItem("activeWedding", JSON.stringify(weddingData));
        
        navigate('/dashboard'); 
    };

    const handleCreate = (e) => {
        e.preventDefault();
        const newEntry = {
            id: Date.now(), 
            names: newWedding.names,
            date: newWedding.date
        };
        
        const updatedList = [...weddings, newEntry];
        setWeddings(updatedList);
        
        // Pass the full object to the select handler
        handleSelectWedding(newEntry);
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '500px' }}>
                {isCreating || weddings.length === 0 ? (
                    <div>
                        <h2>Create New Wedding</h2>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Couple Names</label>
                                <input type="text" placeholder="Sarah & John" value={newWedding.names} onChange={(e) => setNewWedding({...newWedding, names: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Wedding Date</label>
                                <input type="date" value={newWedding.date} onChange={(e) => setNewWedding({...newWedding, date: e.target.value})} required />
                            </div>
                            <button type="submit" className="login-btn">Start Planning</button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <h2>Your Weddings</h2>
                        {weddings.map(w => (
                            <button key={w.id} onClick={() => handleSelectWedding(w)} className="login-btn" style={{ background: 'white', color: 'black', border: '1px solid #ddd', marginBottom: '10px' }}>
                                {w.names}
                            </button>
                        ))}
                        <button style={{ marginTop: '10px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsCreating(true)}>+ Add Another</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WeddingSelector;