import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts & Components
import Layout from './components/layout.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

// Pages
import Dashboard from './pages/Dashboard.jsx';
import Guests from './pages/Guests.jsx';
import Events from './pages/Events.jsx';
import Vendors from './pages/Vendors.jsx';
import Expenses from './pages/Expenses.jsx';

// Placeholder for Roles (since we haven't built this file yet)
const Roles = () => <div style={{padding: 20}}><h2>Role Management</h2><p>Coming Soon...</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- PUBLIC ROUTES (No Sidebar/Header) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* --- PROTECTED ROUTES (Inside Layout) --- */}
        {/* All routes inside here will have the Header, Sidebar & Footer */}
        <Route element={<Layout />}>
           
           {/* The "/" path loads the Dashboard by default */}
           <Route path="/" element={<Dashboard />} />
           
           <Route path="/guests" element={<Guests />} />
           <Route path="/events" element={<Events />} />
           <Route path="/vendors" element={<Vendors />} />
           <Route path="/expenses" element={<Expenses />} />
           <Route path="/roles" element={<Roles />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;