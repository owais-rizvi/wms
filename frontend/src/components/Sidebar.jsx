import { Link } from 'react-router-dom'; // <--- 1. Import this

function Sidebar(){
    return(
        <div className="Sidebar">
            <ul>
                {/* 2. Use <Link to="..."> instead of <a href="..."> */}
                
                <Link to="/">
                    <li>Dashboard</li> {/* Fixed typo: Dashbooard -> Dashboard */}
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
            </ul>
        </div>
    );
}

export default Sidebar;
    
