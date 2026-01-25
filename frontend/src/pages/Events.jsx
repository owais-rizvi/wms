import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api.js';

function Events() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
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
            setNewEvent({ title: '', description: '', date: '', time: '', location: '' });
            setShowForm(false);
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

    if (loading) return <div>Loading events...</div>;

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Events & Tasks ({events.filter(e => e.status === 'pending').length} pending)</h1>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    {showForm ? 'Cancel' : '+ Add Event'}
                </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {showForm && (
                <form onSubmit={handleAddEvent} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Event Title"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={newEvent.location}
                            onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                        />
                        <input
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        />
                        <input
                            type="time"
                            value={newEvent.time}
                            onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        />
                    </div>
                    <textarea
                        placeholder="Description (optional)"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        style={{ width: '100%', padding: '10px', marginBottom: '10px', minHeight: '60px' }}
                    />
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
                        Add Event
                    </button>
                </form>
            )}

            <div style={{ display: 'grid', gap: '10px' }}>
                {events.map(event => (
                    <div key={event._id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <strong>{event.title}</strong>
                                <span style={{ 
                                    padding: '2px 8px', 
                                    backgroundColor: event.status === 'completed' ? '#d4edda' : '#fff3cd',
                                    color: event.status === 'completed' ? '#155724' : '#856404',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem'
                                }}>
                                    {event.status === 'completed' ? 'Completed' : 'Pending'}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                {event.date && new Date(event.date).toLocaleDateString()} 
                                {event.time && ` at ${event.time}`}
                                {event.location && ` • ${event.location}`}
                            </div>
                            {event.description && <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px' }}>{event.description}</div>}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button 
                                onClick={() => toggleStatus(event._id, event.status)}
                                style={{ 
                                    padding: '5px 10px', 
                                    backgroundColor: event.status === 'completed' ? '#ffc107' : '#28a745', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '3px' 
                                }}
                            >
                                {event.status === 'completed' ? 'Mark Pending' : 'Mark Done'}
                            </button>
                            <button 
                                onClick={() => deleteEvent(event._id)}
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

export default Events;