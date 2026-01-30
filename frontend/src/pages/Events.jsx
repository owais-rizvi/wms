import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api.js';
import './Events.css'; // New CSS file for the modal styling

function Events() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: ''
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
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            const data = await apiCall(`/weddings/${weddingId}/events`);
            setEvents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            const event = await apiCall(`/weddings/${weddingId}/events`, {
                method: 'POST',
                body: JSON.stringify(newEvent)
            });
            setEvents([...events, event]);
            
            // Reset and Close Modal
            setNewEvent({ title: '', description: '', date: '', time: '', location: '' });
            setShowModal(false); 
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleStatus = async (eventId, currentStatus) => {
        const weddingId = getWeddingId();
        if (!weddingId) return;

        const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
        try {
            const updatedEvent = await apiCall(`/weddings/${weddingId}/events/${eventId}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });
            setEvents(events.map(e => e._id === eventId ? updatedEvent : e));
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteEvent = async (eventId) => {
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            await apiCall(`/weddings/${weddingId}/events/${eventId}`, {
                method: 'DELETE'
            });
            setEvents(events.filter(e => e._id !== eventId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="loading-state">Loading events...</div>;

    return (
        <div className="page-container">
            
            {/* --- HEADER --- */}
            <div className="events-header">
                <div>
                    <h2 style={{ color: '#540c21', margin: 0 }}>Events & Tasks</h2>
                    <p style={{ color: '#666', margin: '5px 0 0' }}>{events.filter(e => e.status === 'pending').length} tasks pending</p>
                </div>
                <button 
                    className="btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    + Add Event
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* --- MODAL POPUP --- */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        
                        <div className="modal-header">
                            <h3>Add New Event</h3>
                            <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleAddEvent}>
                            <div className="form-group">
                                <label>Event Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Cake Tasting"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Time</label>
                                    <input
                                        type="time"
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. The Grand Hotel"
                                    value={newEvent.location}
                                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description / Notes</label>
                                <textarea
                                    placeholder="Any details to remember..."
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                                    rows="3"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- EVENTS LIST --- */}
            <div className="events-list">
                {events.length === 0 ? (
                    <div className="empty-state">No events yet. Click "+ Add Event" to get started!</div>
                ) : (
                    events.map(event => (
                        <div key={event._id} className={`event-card ${event.status}`}>
                            <div className="event-info">
                                <div className="event-title-row">
                                    <h4 className={event.status === 'completed' ? 'text-strike' : ''}>
                                        {event.title}
                                    </h4>
                                    {event.status === 'completed' && <span className="badge-completed">Done</span>}
                                </div>
                                
                                <div className="event-meta">
                                    {event.date && <span>📅 {new Date(event.date).toLocaleDateString()}</span>}
                                    {event.time && <span>⏰ {event.time}</span>}
                                    {event.location && <span>📍 {event.location}</span>}
                                </div>
                                
                                {event.description && <p className="event-desc">{event.description}</p>}
                            </div>

                            <div className="event-actions">
                                <button 
                                    className={`btn-icon ${event.status === 'completed' ? 'btn-undo' : 'btn-check'}`}
                                    onClick={() => toggleStatus(event._id, event.status)}
                                    title={event.status === 'completed' ? "Mark Pending" : "Mark Done"}
                                >
                                    {event.status === 'completed' ? '↩' : '✓'}
                                </button>
                                <button 
                                    className="btn-icon btn-delete"
                                    onClick={() => deleteEvent(event._id)}
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Events;