import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api.js';

function Guests() {
    const navigate = useNavigate();
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newGuest, setNewGuest] = useState({
        name: '',
        email: '',
        phone: '',
        plusOne: false
    });

    const getWeddingId = () => {
        const savedWedding = localStorage.getItem('activeWedding');
        if (!savedWedding) {
            navigate('/weddings');
            return null;
        }
        const wedding = JSON.parse(savedWedding);
        return wedding._id || wedding.id;
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    const fetchGuests = async () => {
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            const data = await apiCall(`/weddings/${weddingId}/guests`);
            setGuests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGuest = async (e) => {
        e.preventDefault();
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            const guest = await apiCall(`/weddings/${weddingId}/guests`, {
                method: 'POST',
                body: JSON.stringify(newGuest)
            });
            setGuests([...guests, guest]);
            setNewGuest({ name: '', email: '', phone: '', plusOne: false });
            setShowForm(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const updateRSVP = async (guestId, status) => {
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            const updatedGuest = await apiCall(`/weddings/${weddingId}/guests/${guestId}`, {
                method: 'PUT',
                body: JSON.stringify({ rsvpStatus: status })
            });
            setGuests(guests.map(g => g._id === guestId ? updatedGuest : g));
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteGuest = async (guestId) => {
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            await apiCall(`/weddings/${weddingId}/guests/${guestId}`, {
                method: 'DELETE'
            });
            setGuests(guests.filter(g => g._id !== guestId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading guests...</div>;

    const confirmedCount = guests.filter(g => g.rsvpStatus === 'confirmed').length;
    const totalCount = guests.length;

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Guests ({confirmedCount}/{totalCount} confirmed)</h1>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    {showForm ? 'Cancel' : 'Add Guest'}
                </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {showForm && (
                <form onSubmit={handleAddGuest} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Guest Name"
                            value={newGuest.name}
                            onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newGuest.email}
                            onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={newGuest.phone}
                            onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={newGuest.plusOne}
                                onChange={(e) => setNewGuest({...newGuest, plusOne: e.target.checked})}
                            />
                            Plus One
                        </label>
                    </div>
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
                        Add Guest
                    </button>
                </form>
            )}

            <div style={{ display: 'grid', gap: '10px' }}>
                {guests.map(guest => (
                    <div key={guest._id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>{guest.name}</strong>
                            {guest.plusOne && <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#666' }}>+1</span>}
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                {guest.email} {guest.phone && `• ${guest.phone}`}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <select 
                                value={guest.rsvpStatus} 
                                onChange={(e) => updateRSVP(guest._id, e.target.value)}
                                style={{ padding: '5px' }}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="declined">Declined</option>
                            </select>
                            <button 
                                onClick={() => deleteGuest(guest._id)}
                                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Guests;