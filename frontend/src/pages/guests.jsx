import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Guests() {
    const navigate = useNavigate();
    
    // --- STATE ---
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // Form State for Adding Guest
    const [newGuest, setNewGuest] = useState({
        name: '',
        email: '',
        group: 'Friend',
        rsvp: 'Pending'
    });

    // --- 1. FETCH GUESTS ---
    const fetchGuests = async () => {
        const token = localStorage.getItem('jwt');
        const savedWedding = localStorage.getItem("activeWedding");

        if (!token || !savedWedding) {
            navigate('/login');
            return;
        }
        
        const weddingId = JSON.parse(savedWedding).id;

        try {
            const response = await fetch(`http://localhost:3000/api/guests/${weddingId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                setGuests(data);
            }
        } catch (error) {
            console.error("Failed to load guests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    // --- 2. ADD GUEST ---
    const handleAddGuest = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt');
        const wedding = JSON.parse(localStorage.getItem("activeWedding"));

        try {
            const response = await fetch('http://localhost:3000/api/guests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...newGuest,
                    weddingId: wedding.id // Link guest to this specific wedding
                })
            });

            if (response.ok) {
                setShowModal(false); // Close popup
                setNewGuest({ name: '', email: '', group: 'Friend', rsvp: 'Pending' }); // Reset form
                fetchGuests(); // Refresh list
            }
        } catch (error) {
            alert("Error adding guest");
        }
    };

    // --- 3. DELETE GUEST ---
    const handleDelete = async (guestId) => {
        if(!confirm("Are you sure you want to remove this guest?")) return;

        const token = localStorage.getItem('jwt');
        try {
            await fetch(`http://localhost:3000/api/guests/${guestId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Remove from UI immediately without refreshing
            setGuests(guests.filter(g => g.id !== guestId));
        } catch (error) {
            alert("Error deleting guest");
        }
    };

    // --- 4. UPDATE RSVP INSTANTLY ---
    const handleStatusChange = async (guestId, newStatus) => {
        // Optimistic UI Update: Update screen immediately before server responds
        const updatedList = guests.map(g => 
            g.id === guestId ? { ...g, rsvp: newStatus } : g
        );
        setGuests(updatedList);

        const token = localStorage.getItem('jwt');
        try {
            await fetch(`http://localhost:3000/api/guests/${guestId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rsvp: newStatus })
            });
        } catch (error) {
            console.error("Failed to update status");
            fetchGuests(); // Revert if failed
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Guest List ({guests.length})</h2>
                <button 
                    onClick={() => setShowModal(true)}
                    className="btn-primary" 
                    style={{ padding: '10px 20px', background: 'black', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    + Add Guest
                </button>
            </div>

            {loading ? <p>Loading guests...</p> : (
                <table className="standard-table">
                    <thead>
                        <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>Name</th>
                            <th style={{ padding: '10px' }}>Email</th>
                            <th style={{ padding: '10px' }}>Group</th>
                            <th style={{ padding: '10px' }}>RSVP</th>
                            <th style={{ padding: '10px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.map((guest) => (
                            <tr key={guest.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{guest.name}</td>
                                <td style={{ padding: '10px', color: '#666' }}>{guest.email}</td>
                                <td style={{ padding: '10px' }}>{guest.group}</td>
                                <td style={{ padding: '10px' }}>
                                    {/* DROPDOWN FOR RSVP */}
                                    <select 
                                        value={guest.rsvp}
                                        onChange={(e) => handleStatusChange(guest.id, e.target.value)}
                                        style={{ 
                                            padding: '5px', 
                                            borderRadius: '4px',
                                            border: '1px solid #ddd',
                                            fontWeight: 'bold',
                                            color: guest.rsvp === 'Confirmed' ? 'green' : guest.rsvp === 'Declined' ? 'red' : 'orange'
                                        }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Declined">Declined</option>
                                    </select>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <button 
                                        onClick={() => handleDelete(guest.id)}
                                        style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* --- ADD GUEST MODAL (Popup) --- */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '10px', width: '400px' }}>
                        <h3>Add New Guest</h3>
                        <form onSubmit={handleAddGuest} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                            <input 
                                type="text" placeholder="Full Name" required 
                                value={newGuest.name}
                                onChange={e => setNewGuest({...newGuest, name: e.target.value})}
                                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                            />
                            <input 
                                type="email" placeholder="Email Address" 
                                value={newGuest.email}
                                onChange={e => setNewGuest({...newGuest, email: e.target.value})}
                                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                            />
                            <select 
                                value={newGuest.group}
                                onChange={e => setNewGuest({...newGuest, group: e.target.value})}
                                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                            >
                                <option value="Bride's Family">Bride's Family</option>
                                <option value="Groom's Family">Groom's Family</option>
                                <option value="Bride's Friend">Bride's Friend</option>
                                <option value="Groom's Friend">Groom's Friend</option>
                                <option value="Work">Work</option>
                            </select>
                            <select 
                                value={newGuest.rsvp}
                                onChange={e => setNewGuest({...newGuest, rsvp: e.target.value})}
                                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Declined">Declined</option>
                            </select>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '10px', background: 'black', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save Guest</button>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Guests;