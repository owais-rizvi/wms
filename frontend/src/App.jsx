import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts & Components
import Layout from './components/layout.jsx';
import Login from './components/Login.jsx';
import Signup from './components/signup.jsx';
import WeddingSelector from './components/Weddingselector.jsx';
import LandingPage from './components/Landingpage.jsx'; 

// Pages

import Dashboard from './pages/Dashboard.jsx';
import Guests from './pages/Guests.jsx';
import Events from './pages/Events.jsx';
import Vendors from './pages/Vendors.jsx';
import Expenses from './pages/Expenses.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- PUBLIC / SETUP ROUTES --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* <--- 2. ADD THIS ROUTE HERE */}
        <Route path="/weddings" element={<WeddingSelector />} /> 

        {/* --- PROTECTED APP ROUTES (With Sidebar & Header) --- */}
        <Route element={<Layout />}>
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/guests" element={<Guests />} />
           <Route path="/events" element={<Events />} />
           <Route path="/vendors" element={<Vendors />} />
           <Route path="/expenses" element={<Expenses />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;