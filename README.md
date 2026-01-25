# Wedding Management System (WMS)

A full-stack web application for managing wedding planning with guest lists, events, vendors, and budget tracking.

## Features

- **User Authentication** - Secure login/signup with JWT cookies
- **Wedding Management** - Create and manage multiple weddings
- **Guest Management** - Track RSVPs, plus-ones, and contact details
- **Event Planning** - Manage tasks and events with completion tracking
- **Vendor Management** - Track vendor contacts, costs, and booking status
- **Budget Tracking** - Real-time expense tracking and budget calculations
- **Dashboard** - Live statistics and overview of all wedding data

## Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Vanilla CSS for styling

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication with httpOnly cookies
- bcrypt for password hashing

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wms
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create `.env` file in `backend/src/`:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/wms
   JWT_SECRET_KEY=your-secret-key
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Run the Application**
   ```bash
   # Backend (from backend directory)
   npm start
   
   # Frontend (from frontend directory)
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

