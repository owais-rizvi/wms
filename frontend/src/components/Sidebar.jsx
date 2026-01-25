import { Link } from 'react-router-dom'; // <--- 1. Import this

function Sidebar(){
    return(
        <div className="Sidebar" >
            <ul>
                {/* 2. Use <Link to="..."> instead of <a href="..."> */}
                
                <Link to="/">
                    <li tabIndex={0}>Dashboard</li> {/* Fixed typo: Dashbooard -> Dashboard */}
                </Link>

                <Link to="/guests">
                    <li tabIndex={0}>Guests</li>
                </Link>

                <Link to="/events">
                    <li tabIndex={0}>Events</li>
                </Link>

                <Link to="/vendors">
                    <li tabIndex={0}>Vendors</li>
                </Link>

                <Link to="/expenses">
                    <li tabIndex={0}>Expenses</li>
                </Link>

                <Link to="/roles">
                    <li tabIndex={0}>Roles</li>
                </Link>
            </ul>
        </div>
    );
}

export default Sidebar;
    
