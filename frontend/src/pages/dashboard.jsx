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
            // Get credentials
            const token = localStorage.getItem('authToken');
            const savedWedding = localStorage.getItem("activeWedding");

            if (!token || !savedWedding) {
                navigate('/login');
                return;
            }

            const wedding = JSON.parse(savedWedding);

            try {
                // 2. Fetch the Summary from the Backend
                // The Backend must calculate these numbers from the Guests, Expenses, Events, and Vendors tables.
                const response = await fetch(`http://localhost:5000/api/dashboard/${wedding.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setStats(data); // Update state with real numbers
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