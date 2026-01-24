import { Link } from 'react-router-dom';

function Dashboard() {
    // Dummy Data
    const stats = {
        guests: 120,
        confirmed: 85,
        budget: 50000,
        spent: 15000,
        tasks: 8,
        vendors: 6
    };

    return (
        <div className="page-container">
            
            {/* Stats Grid - Moved to top since Welcome section is gone */}
            <div className="vendor-grid" style={{ marginTop: '20px' }}> 
                <div className="summary-card">
                    <h3>Guests</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>
                        {stats.confirmed} / {stats.guests}
                    </div>
                    <span>Confirmed</span>
                </div>

                <div className="summary-card">
                    <h3>Budget</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>
                        ${stats.spent.toLocaleString()}
                    </div>
                    <span>Spent of ${stats.budget.toLocaleString()}</span>
                </div>

                <div className="summary-card">
                    <h3>Pending Tasks</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>
                        {stats.tasks}
                    </div>
                    <span>To-do items</span>
                </div>

                <div className="summary-card">
                    <h3>Vendors</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>
                        {stats.vendors}
                    </div>
                    <span>Hired</span>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;