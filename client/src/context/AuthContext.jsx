import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { destinationService } from '../services/destinationService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load current user from token on startup
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('wanderlust_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (res.success && res.user) {
          setUser(res.user);
          setFavorites(res.user.favorites || []);
        }
      } catch (err) {
        console.error('Failed to load authenticated user:', err.message);
        localStorage.removeItem('wanderlust_token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Directly set token and user upon successful OTP verification
  const loginWithToken = (token, userData) => {
    localStorage.setItem('wanderlust_token', token);
    setUser(userData);
    setFavorites(userData.favorites || []);
  };

  // Login handler
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('wanderlust_token', data.token);
      setUser(data.user);
      setFavorites(data.user.favorites || []);
      toast.success(`Welcome back, ${data.user.name}!`);
      return data;
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.isUnverified) {
        toast.error(errorData.message || 'Please verify your email before logging in.');
        return { isUnverified: true, email };
      }
      toast.error(errorData?.message || err.message || 'Login failed');
      throw err;
    }
  };

  // Register handler - sends OTP email and redirects to verification page
  const register = async (name, email, password) => {
    try {
      const data = await authService.register(name, email, password);
      toast.success(data.message || 'Verification code sent to your email!');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(errorMsg);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('wanderlust_token');
    setUser(null);
    setFavorites([]);
    toast.success('Logged out successfully');
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const data = await authService.updateProfile(profileData);
      setUser(data.user);
      toast.success('Profile updated successfully');
      return data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update profile');
      throw err;
    }
  };

  // Toggle Favorite
  const toggleFavorite = async (destinationId) => {
    if (!user) {
      toast.error('Please log in to save places to your favorites');
      return false;
    }

    const isFav = favorites.some(fav =>
      typeof fav === 'object' ? fav._id === destinationId : fav === destinationId
    );

    try {
      if (isFav) {
        const res = await destinationService.removeFavorite(destinationId);
        setFavorites(res.favorites);
        toast.success('Removed from favorites');
      } else {
        const res = await destinationService.addFavorite(destinationId);
        setFavorites(res.favorites);
        toast.success('Added to favorites!');
      }
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update favorites');
      return false;
    }
  };

  const removeBulkFavorites = async (destinationIds) => {
    try {
      const res = await destinationService.removeBulkFavorites(destinationIds);
      setFavorites(res.favorites || []);
      toast.success(res.message || 'Places removed from favorites');
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to remove favorites');
      throw err;
    }
  };

  const clearAllFavorites = async () => {
    try {
      const res = await destinationService.clearAllFavorites();
      setFavorites([]);
      toast.success('All favorites cleared');
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to clear favorites');
      throw err;
    }
  };

  const isFavorite = (destinationId) => {
    return favorites.some(fav =>
      typeof fav === 'object' ? fav._id === destinationId : fav === destinationId
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        favorites,
        setFavorites,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        loginWithToken,
        logout,
        updateProfile,
        toggleFavorite,
        removeBulkFavorites,
        clearAllFavorites,
        isFavorite
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
