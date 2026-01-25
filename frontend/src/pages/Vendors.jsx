import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api.js';

function Vendors() {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newVendor, setNewVendor] = useState({
        name: '',
        category: '',
        contact: '',
        email: '',
        cost: 0
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
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            const data = await apiCall(`/weddings/${weddingId}/vendors`);
            setVendors(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVendor = async (e) => {
        e.preventDefault();
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            const vendor = await apiCall(`/weddings/${weddingId}/vendors`, {
                method: 'POST',
                body: JSON.stringify(newVendor)
            });
            setVendors([...vendors, vendor]);
            setNewVendor({ name: '', category: '', contact: '', email: '', cost: 0 });
            setShowForm(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const updateStatus = async (vendorId, status) => {
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            const updatedVendor = await apiCall(`/weddings/${weddingId}/vendors/${vendorId}`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
            setVendors(vendors.map(v => v._id === vendorId ? updatedVendor : v));
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteVendor = async (vendorId) => {
        const weddingId = getWeddingId();
        if (!weddingId) return;

        try {
            await apiCall(`/weddings/${weddingId}/vendors/${vendorId}`, {
                method: 'DELETE'
            });
            setVendors(vendors.filter(v => v._id !== vendorId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading vendors...</div>;

    const bookedCount = vendors.filter(v => v.status === 'booked').length;

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Vendors ({bookedCount} booked)</h1>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    {showForm ? 'Cancel' : '+ Add Vendor'}
                </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {showForm && (
                <form onSubmit={handleAddVendor} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Vendor Name"
                            value={newVendor.name}
                            onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Category (e.g., Photography)"
                            value={newVendor.category}
                            onChange={(e) => setNewVendor({...newVendor, category: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Contact Number"
                            value={newVendor.contact}
                            onChange={(e) => setNewVendor({...newVendor, contact: e.target.value})}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newVendor.email}
                            onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                        />
                        <input
                            type="number"
                            placeholder="Cost"
                            value={newVendor.cost}
                            onChange={(e) => setNewVendor({...newVendor, cost: Number(e.target.value)})}
                        />
                    </div>
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
                        Add Vendor
                    </button>
                </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                {vendors.map(vendor => (
                    <div key={vendor._id} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <strong>{vendor.name}</strong>
                            <span style={{ padding: '4px 8px', backgroundColor: '#e9ecef', borderRadius: '4px', fontSize: '0.8rem' }}>
                                {vendor.category}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                            {vendor.contact && <div>📞 {vendor.contact}</div>}
                            {vendor.email && <div>📧 {vendor.email}</div>}
                            <div>💰 Rs {vendor.cost}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <select 
                                value={vendor.status} 
                                onChange={(e) => updateStatus(vendor._id, e.target.value)}
                                style={{ padding: '5px', flex: 1 }}
                            >
                                <option value="contacted">Contacted</option>
                                <option value="booked">Booked</option>
                                <option value="paid">Paid</option>
                            </select>
                            <button 
                                onClick={() => deleteVendor(vendor._id)}
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

export default Vendors;