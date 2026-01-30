import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api.js';
import './Vendors.css';

function Vendors() {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    
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
            
            // Reset and Close Modal
            setNewVendor({ name: '', category: '', contact: '', email: '', cost: 0 });
            setShowModal(false);
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

    if (loading) return <div className="loading-state">Loading vendors...</div>;

    const bookedCount = vendors.filter(v => v.status === 'booked' || v.status === 'paid').length;

    return (
        <div className="page-container">
            
            {/* --- HEADER --- */}
            <div className="vendors-header">
                <div>
                    <h2 style={{ color: '#540c21', margin: 0 }}>Vendors</h2>
                    <p style={{ color: '#666', margin: '5px 0 0' }}>{bookedCount} booked / {vendors.length} total</p>
                </div>
                <button 
                    className="btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    + Add Vendor
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* --- MODAL POPUP --- */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        
                        <div className="modal-header">
                            <h3>Add New Vendor</h3>
                            <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleAddVendor}>
                            <div className="form-group">
                                <label>Vendor Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Elegant Flowers"
                                    value={newVendor.name}
                                    onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Photography"
                                        value={newVendor.category}
                                        onChange={(e) => setNewVendor({...newVendor, category: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Estimated Cost</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={newVendor.cost}
                                        onChange={(e) => setNewVendor({...newVendor, cost: Number(e.target.value)})}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        placeholder="Contact Number"
                                        value={newVendor.contact}
                                        onChange={(e) => setNewVendor({...newVendor, contact: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        placeholder="vendor@example.com"
                                        value={newVendor.email}
                                        onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Add Vendor</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- VENDORS GRID --- */}
            <div className="vendors-grid">
                {vendors.length === 0 ? (
                    <div className="empty-state">No vendors added yet. Click "+ Add Vendor" to start hiring!</div>
                ) : (
                    vendors.map(vendor => (
                        <div key={vendor._id} className="vendor-card">
                            <div className="vendor-card-header">
                                <span className="vendor-category">{vendor.category}</span>
                                <div className={`status-dot ${vendor.status}`}></div>
                            </div>
                            
                            <div className="vendor-info">
                                <h4>{vendor.name}</h4>
                                <div className="vendor-details">
                                    {vendor.contact && <div className="detail-row"><span>Phone:</span> {vendor.contact}</div>}
                                    {vendor.email && <div className="detail-row"><span>Email:</span> {vendor.email}</div>}
                                </div>
                                <div className="vendor-cost">
                                    <span>Estimated Cost</span>
                                    <strong>${vendor.cost.toLocaleString()}</strong>
                                </div>
                            </div>

                            <div className="vendor-actions">
                                <select 
                                    className="status-select"
                                    value={vendor.status} 
                                    onChange={(e) => updateStatus(vendor._id, e.target.value)}
                                >
                                    <option value="contacted">Contacted</option>
                                    <option value="booked">Booked</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                </select>
                                
                                <button 
                                    className="btn-text-delete"
                                    onClick={() => deleteVendor(vendor._id)}
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

export default Vendors;