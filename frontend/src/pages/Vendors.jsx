import { useState } from 'react';

function Vendors() {
    const [vendors] = useState([
        { id: 1, name: "SnapShot Studio", category: "Photography", cost: 2500, paid: 1000, status: "Hired" },
        { id: 2, name: "Gourmet Bites", category: "Catering", cost: 8000, paid: 0, status: "Negotiating" },
        { id: 3, name: "DJ Beats", category: "Music", cost: 1200, paid: 1200, status: "Paid in Full" },
    ]);

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Vendor Team</h2>
                <button className="btn-primary" style={{ padding: '10px 20px', background: 'black', color: 'white', border: 'none', borderRadius: '5px' }}>+ Add Vendor</button>
            </div>

            <div className="vendor-grid">
                {vendors.map((vendor) => (
                    <div key={vendor.id} className="vendor-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>{vendor.name}</h3>
                            <span style={{ background: '#eee', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                {vendor.category}
                            </span>
                        </div>
                        
                        <div style={{ marginBottom: '15px', color: '#555' }}>
                            <p style={{ margin: '5px 0' }}><strong>Cost:</strong> ${vendor.cost}</p>
                            <p style={{ margin: '5px 0' }}><strong>Paid:</strong> ${vendor.paid}</p>
                            <p style={{ margin: '5px 0' }}><strong>Status:</strong> {vendor.status}</p>
                        </div>

                        <button style={{ width: '100%', padding: '8px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Vendors;