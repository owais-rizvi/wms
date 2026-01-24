import { useState } from 'react';

function Events() {
    const [events] = useState([
        { id: 1, time: "10:00 AM", title: "Haldi Ceremony", location: "Poolside", status: "Upcoming" },
        { id: 2, time: "01:00 PM", title: "Lunch Buffet", location: "Grand Hall", status: "Upcoming" },
        { id: 3, time: "06:00 PM", title: "Sangeet Night", location: "Ballroom", status: "Pending" },
    ]);

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Event Schedule</h2>
                <button className="btn-primary" style={{ padding: '10px 20px', background: 'black', color: 'white', border: 'none', borderRadius: '5px' }}>+ Add Event</button>
            </div>

            <div className="timeline-list">
                {events.map((event) => (
                    <div key={event.id} className="event-card">
                        <div className="time-badge">{event.time}</div>
                        <div className="event-info">
                            <h3 style={{ margin: '0 0 5px 0' }}>{event.title}</h3>
                            <p style={{ margin: 0, color: '#666' }}>📍 {event.location}</p>
                        </div>
                        <div className="event-status">
                            <span style={{ 
                                padding: '5px 10px', 
                                background: event.status === 'Upcoming' ? '#e6fffa' : '#fff5f5', 
                                color: event.status === 'Upcoming' ? '#008080' : '#c53030',
                                borderRadius: '15px',
                                fontSize: '0.8rem'
                            }}>
                                {event.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Events;