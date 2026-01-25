import { Link } from 'react-router-dom'; 

function Sidebar(){
    
    // --- 1. Logic to get Name & Days Left ---
    const savedData = localStorage.getItem("activeWedding");
    // Default to "Your Wedding" if nothing is found
    const wedding = savedData ? JSON.parse(savedData) : { names: "Your Wedding", date: "" };

    const calculateDaysLeft = (targetDate) => {
        if (!targetDate) return 0;
        const today = new Date();
        const weddingDate = new Date(targetDate);
        const diffTime = weddingDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const daysLeft = calculateDaysLeft(wedding.date);
    // ----------------------------------------

    return(
        <div className="Sidebar">
            
            {/* --- NEW PART: Couple Name & Countdown --- */}
            {/* Minimal inline CSS just for layout/spacing of this specific part */}
            <div style={{ padding: '20px 20px 10px 20px', borderBottom: '1px solid rgba(0,0,0,0.1)', marginBottom: '10px' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>
                    {wedding.names}
                </h3>
                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d63384' }}>
                        {daysLeft}
                    </span> Days to go
                </div>
            </div>
            {/* ----------------------------------------- */}

            <ul>
                <Link to="/dashboard">
                    <li>Dashboard</li>
                </Link>

                <Link to="/guests">
                    <li>Guests</li>
                </Link>

                <Link to="/events">
                    <li>Events</li>
                </Link>

                <Link to="/vendors">
                    <li>Vendors</li>
                </Link>

                <Link to="/expenses">
                    <li>Expenses</li>
                </Link>

                <Link to="/roles">
                    <li>Roles</li>
                </Link>

                {/* Added a small link to go back to the selector page */}
                <div style={{ marginTop: '20px', paddingLeft: '10px' }}>
                    <Link to="/weddings" style={{ fontSize: '0.8rem', color: '#999', textDecoration: 'none' }}>
                        ← Switch Wedding
                    </Link>
                </div>
            </ul>
        </div>
    );
}

export default Sidebar;