import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    
    // 1. Initial State (starts at 0)
    const [stats, setStats] = useState({
        guestsTotal: 0,
        guestsConfirmed: 0,
        budgetTotal: 0,
        budgetSpent: 0,
        tasksPending: 0,
        vendorsHired: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Get saved wedding
            const savedWedding = localStorage.getItem("activeWedding");

            if (!savedWedding) {
                navigate('/weddings');
                return;
            }

            const wedding = JSON.parse(savedWedding);
            const weddingId = wedding._id || wedding.id;

            try {
                // Fetch wedding details with cookies
                const response = await fetch(`http://localhost:3000/api/weddings/${weddingId}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    // For now, just show basic wedding info
                    // You can expand this when you add guests, budget, etc.
                    setStats({
                        guestsTotal: 0,
                        guestsConfirmed: 0,
                        budgetTotal: 0,
                        budgetSpent: 0,
                        tasksPending: 0,
                        vendorsHired: 0
                    });
                } else if (response.status === 401) {
                    navigate('/login');
                    return;
                } else {
                    setError("Failed to load dashboard data");
                }
            } catch (err) {
                console.error("Error fetching dashboard:", err);
                setError("Server connection failed");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading your dashboard...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div className="page-container">
            
            <div className="vendor-grid" style={{ marginTop: '20px' }}> 
                
                {/* GUESTS CARD */}
                <div className="summary-card">
                    <h3>Guests</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>
                        {stats.guestsConfirmed} / {stats.guestsTotal}
                    </div>
                    <span>Confirmed</span>
                </div>

                {/* BUDGET CARD */}
                <div className="summary-card">
                    <h3>Budget</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>
                        ${stats.budgetSpent.toLocaleString()}
                    </div>
                    <span>Spent of ${stats.budgetTotal.toLocaleString()}</span>
                </div>

                {/* TASKS CARD (From Events) */}
                <div className="summary-card">
                    <h3>Pending Tasks</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>
                        {stats.tasksPending}
                    </div>
                    <span>To-do items</span>
                </div>

                {/* VENDORS CARD */}
                <div className="summary-card">
                    <h3>Vendors</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>
                        {stats.vendorsHired}
                    </div>
                    <span>Hired</span>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;