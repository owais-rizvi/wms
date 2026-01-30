import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api.js';
import './Guests.css'; // Updated CSS file

function Guests() {
    const navigate = useNavigate();
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    
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
            
            // Reset and Close Modal
            setNewGuest({ name: '', email: '', phone: '', plusOne: false });
            setShowModal(false);
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

    if (loading) return <div className="loading-state">Loading guests...</div>;

    const confirmedCount = guests.filter(g => g.rsvpStatus === 'confirmed').length;
    const totalCount = guests.length;

    return (
        <div className="page-container">
            
            {/* --- HEADER --- */}
            <div className="guests-header">
                <div>
                    <h2 style={{ color: '#540c21', margin: 0 }}>Guest List</h2>
                    <p style={{ color: '#666', margin: '5px 0 0' }}>{confirmedCount} confirmed / {totalCount} invited</p>
                </div>
                <button 
                    className="btn-primary" 
                    onClick={() => setShowModal(true)}
                >
                    + Add Guest
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* --- MODAL POPUP --- */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        
                        <div className="modal-header">
                            <h3>Add New Guest</h3>
                            <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleAddGuest}>
                            <div className="form-group">
                                <label>Guest Name</label>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={newGuest.name}
                                    onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        value={newGuest.email}
                                        onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="(555) 123-4567"
                                        value={newGuest.phone}
                                        onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={newGuest.plusOne}
                                        onChange={(e) => setNewGuest({...newGuest, plusOne: e.target.checked})}
                                    />
                                    Include Plus One (+1)
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Add Guest</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- GUESTS LIST --- */}
            <div className="guest-list">
                {guests.length === 0 ? (
                    <div className="empty-state">No guests added yet. Click "+ Add Guest" to invite someone!</div>
                ) : (
                    guests.map(guest => (
                        <div key={guest._id} className="guest-row">
                            <div className="guest-info">
                                <div className="guest-name-row">
                                    <strong>{guest.name}</strong>
                                    {guest.plusOne && <span className="badge-plus-one">+1 Guest</span>}
                                </div>
                                <div className="guest-contact">
                                    {guest.email && <span>{guest.email}</span>}
                                    {guest.email && guest.phone && <span> • </span>}
                                    {guest.phone && <span>{guest.phone}</span>}
                                </div>
                            </div>

                            <div className="guest-actions">
                                <select 
                                    className={`rsvp-select status-${guest.rsvpStatus}`}
                                    value={guest.rsvpStatus} 
                                    onChange={(e) => updateRSVP(guest._id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="declined">Declined</option>
                                </select>
                                
                                <button 
                                    className="btn-text-delete"
                                    onClick={() => deleteGuest(guest._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Guests;