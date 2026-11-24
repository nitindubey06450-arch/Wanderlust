import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WanderlustAI from './components/WanderlustAI';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Explore from './pages/Explore';
import DestinationDetails from './pages/DestinationDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import AddPlace from './pages/AddPlace';
import EditPlace from './pages/EditPlace';
import MyPlaces from './pages/MyPlaces';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import StateTouristExplorer from './pages/StateTouristExplorer';
import TrainTicket from './pages/TrainTicket';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#0f172a',
                  color: '#fff',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: '600',
                },
              }}
            />
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Home Page requires authentication as per First Screen Requirement */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                
                {/* Explore & Destination Details */}
                <Route path="/explore" element={<Explore />} />
                <Route path="/destinations/:id" element={<DestinationDetails />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                
                {/* Protected User Listing Management Routes */}
                <Route
                  path="/places/new"
                  element={
                    <ProtectedRoute>
                      <AddPlace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/places/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EditPlace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-places"
                  element={
                    <ProtectedRoute>
                      <MyPlaces />
                    </ProtectedRoute>
                  }
                />

                {/* Protected User Profile & Favorites Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* State Tourist Explorer — AI-powered state guide */}
                <Route
                  path="/state-explorer"
                  element={
                    <ProtectedRoute>
                      <StateTouristExplorer />
                    </ProtectedRoute>
                  }
                />

                {/* Train Ticket Booking Routes */}
                <Route path="/trains" element={<TrainTicket />} />
                <Route path="/train-ticket" element={<TrainTicket />} />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            {/* Wanderlust AI Floating Assistant */}
            <WanderlustAI />
            
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
