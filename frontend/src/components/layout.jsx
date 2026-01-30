import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './layout.css';

function Layout() {
    return (
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            
            {/* 1. Header takes full width at the top */}
            <Header />

            <div className="main-body" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                
                {/* 2. Sidebar stays fixed on the left */}
                <Sidebar />

                {/* 3. The 'Outlet' is where Dashboard/Guests pages will appear */}
                <div className="page-content" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </div>
            
        </div>
    );
}

export default Layout;