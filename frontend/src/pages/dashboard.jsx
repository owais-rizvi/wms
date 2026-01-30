import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    
    // --- STATE ---
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

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            const savedWedding = localStorage.getItem("activeWedding");

            if (!savedWedding) {
                navigate('/weddings');
                return;
            }

            const wedding = JSON.parse(savedWedding);
            const weddingId = wedding._id || wedding.id;

            try {
                // Fetch all data in parallel
                const [weddingRes, guestsRes, eventsRes, vendorsRes, expensesRes] = await Promise.all([
                    fetch(`http://localhost:3000/api/weddings/${weddingId}`, { credentials: 'include' }),
                    fetch(`http://localhost:3000/api/weddings/${weddingId}/guests`, { credentials: 'include' }),
                    fetch(`http://localhost:3000/api/weddings/${weddingId}/events`, { credentials: 'include' }),
                    fetch(`http://localhost:3000/api/weddings/${weddingId}/vendors`, { credentials: 'include' }),
                    fetch(`http://localhost:3000/api/weddings/${weddingId}/expenses`, { credentials: 'include' })
                ]);

                if (weddingRes.ok && guestsRes.ok && eventsRes.ok && vendorsRes.ok && expensesRes.ok) {
                    const guests = await guestsRes.json();
                    const events = await eventsRes.json();
                    const vendors = await vendorsRes.json();
                    const expenses = await expensesRes.json();
                    
                    const confirmedGuests = guests.filter(g => g.rsvpStatus === 'confirmed').length;
                    const pendingTasks = events.filter(e => e.status === 'pending').length;
                    const bookedVendors = vendors.filter(v => v.status === 'booked' || v.status === 'paid').length;
                    const totalSpent = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
                    
                    const weddingData = await weddingRes.json();
                    // Default to 50000 if not set
                    const totalBudget = weddingData.budget || 50000; 

                    setStats({
                        guestsTotal: guests.length,
                        guestsConfirmed: confirmedGuests,
                        budgetTotal: totalBudget,
                        budgetSpent: totalSpent,
                        tasksPending: pendingTasks,
                        vendorsHired: bookedVendors
                    });
                } else if (weddingRes.status === 401) {
                    navigate('/login');
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

    // --- CALCULATE PERCENTAGES ---
    const guestPercentage = stats.guestsTotal > 0 
        ? Math.round((stats.guestsConfirmed / stats.guestsTotal) * 100) 
        : 0;
        
    const budgetPercentage = stats.budgetTotal > 0 
        ? Math.round((stats.budgetSpent / stats.budgetTotal) * 100) 
        : 0;

    if (loading) return <div className="dashboard-loading">Loading your dashboard...</div>;
    if (error) return <div className="dashboard-error">{error}</div>;

    return (
        <div className="dashboard-container">
            
            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <p>Welcome back to your planning overview</p>
            </div>

            {/* --- 1. TOP STATS GRID (Clean Text Only) --- */}
            <div className="stats-grid"> 
                <div className="stat-card">
                    <div className="card-label">Guests</div>
                    <div className="card-value">{stats.guestsConfirmed} / {stats.guestsTotal}</div>
                    <div className="card-subtext">Confirmed</div>
                </div>

                <div className="stat-card">
                    <div className="card-label">Budget</div>
                    <div className="card-value">${stats.budgetSpent.toLocaleString()}</div>
                    <div className="card-subtext">Spent</div>
                </div>

                <div className="stat-card">
                    <div className="card-label">Pending Tasks</div>
                    <div className="card-value">{stats.tasksPending}</div>
                    <div className="card-subtext">To-do items</div>
                </div>

                <div className="stat-card">
                    <div className="card-label">Vendors</div>
                    <div className="card-value">{stats.vendorsHired}</div>
                    <div className="card-subtext">Hired</div>
                </div>
            </div>

            {/* --- 2. QUICK OVERVIEW SECTION --- */}
            <div className="overview-section">
                <h3 className="overview-title">Quick Overview</h3>
                
                <div className="overview-grid">
                    
                    {/* Guest Progress */}
                    <div className="progress-item">
                        <div className="progress-header">
                            <strong>Guest List Progress</strong>
                            <span>{guestPercentage}% Confirmed</span>
                        </div>
                        <div className="progress-track">
                            <div 
                                className="progress-fill fill-burgundy" 
                                style={{ width: `${guestPercentage}%` }}
                            ></div>
                        </div>
                        <p className="progress-caption">
                            {stats.guestsConfirmed} confirmed out of {stats.guestsTotal} total guests.
                        </p>
                    </div>

                    {/* Budget Progress */}
                    <div className="progress-item">
                        <div className="progress-header">
                            <strong>Budget Utilization</strong>
                            <span className={budgetPercentage > 100 ? 'text-danger' : ''}>
                                {budgetPercentage}% Used
                            </span>
                        </div>
                        <div className="progress-track">
                            <div 
                                className={`progress-fill ${budgetPercentage > 100 ? 'fill-red' : 'fill-burgundy'}`}
                                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                            ></div>
                        </div>
                        <p className="progress-caption">
                            ${stats.budgetSpent.toLocaleString()} spent of ${stats.budgetTotal.toLocaleString()} total budget.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;