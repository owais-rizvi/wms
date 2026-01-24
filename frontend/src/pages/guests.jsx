import { useState } from 'react';

function Guests() {
    const [guests] = useState([
        { id: 1, name: "Alice Johnson", email: "alice@example.com", group: "Bride's Friend", rsvp: "Confirmed" },
        { id: 2, name: "Bob Smith", email: "bob@example.com", group: "Groom's Family", rsvp: "Pending" },
        { id: 3, name: "Charlie Brown", email: "charlie@test.com", group: "Work", rsvp: "Declined" },
    ]);

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Guest List ({guests.length})</h2>
                <button className="btn-primary" style={{ padding: '10px 20px', background: 'black', color: 'white', border: 'none', borderRadius: '5px' }}>+ Add Guest</button>
            </div>

            <table className="standard-table">
                <thead>
                    <tr style={{ background: '#f9f9f9' }}>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Group</th>
                        <th>RSVP</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {guests.map((guest) => (
                        <tr key={guest.id}>
                            <td>{guest.name}</td>
                            <td>{guest.email}</td>
                            <td>{guest.group}</td>
                            <td>
                                <span style={{ 
                                    color: guest.rsvp === 'Confirmed' ? 'green' : 
                                           guest.rsvp === 'Declined' ? 'red' : 'orange',
                                    fontWeight: 'bold'
                                }}>
                                    {guest.rsvp}
                                </span>
                            </td>
                            <td>
                                <button style={{ marginRight: '10px', cursor: 'pointer' }}>Edit</button>
                                <button style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Guests;