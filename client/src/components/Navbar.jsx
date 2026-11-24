import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Compass, Heart, User, LogOut, Menu, X, Shield, PlusCircle, Building, Sun, Moon, Flag, Train } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isHome = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHome
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800 py-3'
          : 'bg-gradient-to-b from-slate-950/70 to-transparent py-5 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight ${isScrolled || !isHome ? 'text-slate-900 dark:text-white' : 'text-white'}`}>
                Wanderlust
              </span>
              <span className={`text-[10px] uppercase tracking-widest font-semibold ${isScrolled || !isHome ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-300'}`}>
                Explorer
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              to="/explore"
              className={`font-medium text-sm transition-colors hover:text-emerald-500 ${
                isScrolled || !isHome ? 'text-slate-700 dark:text-slate-200' : 'text-white/90'
              }`}
            >
              Explore
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/places/new"
                  className={`flex items-center gap-1.5 font-semibold text-sm transition-colors hover:text-emerald-500 ${
                    isScrolled || !isHome ? 'text-slate-700 dark:text-slate-200' : 'text-white/90'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-emerald-500" />
                  <span>Add New Place</span>
                </Link>

                <Link
                  to="/my-places"
                  className={`flex items-center gap-1.5 font-medium text-sm transition-colors hover:text-emerald-500 ${
                    isScrolled || !isHome ? 'text-slate-700 dark:text-slate-200' : 'text-white/90'
                  }`}
                >
                  <Building className="w-4 h-4 text-emerald-500" />
                  <span>My Places</span>
                </Link>

                <Link
                  to="/favorites"
                  className={`flex items-center gap-1.5 font-medium text-sm transition-colors hover:text-emerald-500 ${
                    isScrolled || !isHome ? 'text-slate-700 dark:text-slate-200' : 'text-white/90'
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                  <span>Favorites</span>
                </Link>

                <Link
                  to="/state-explorer"
                  className={`flex items-center gap-1.5 font-medium text-sm transition-colors hover:text-emerald-500 ${
                    isScrolled || !isHome ? 'text-slate-700 dark:text-slate-200' : 'text-white/90'
                  }`}
                >
                  <Flag className="w-4 h-4 text-amber-500" />
                  <span>India Explorer</span>
                </Link>

                <Link
                  to="/trains"
                  className={`flex items-center gap-1.5 font-medium text-sm transition-colors hover:text-emerald-500 ${
                    isScrolled || !isHome ? 'text-slate-700 dark:text-slate-200' : 'text-white/90'
                  }`}
                >
                  <Train className="w-4 h-4 text-blue-500" />
                  <span>Trains</span>
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 font-semibold text-xs bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-full hover:bg-emerald-200 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* Desktop Actions + Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Dark/Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all ${
                isScrolled || !isHome
                  ? 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:scale-105'
                  : 'border-white/30 bg-white/10 text-amber-300 hover:bg-white/20 hover:scale-105'
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-slate-200/50 bg-white/20 backdrop-blur-sm hover:ring-2 hover:ring-emerald-500 transition-all"
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-500"
                  />
                  <span className={`text-sm font-semibold pr-2 ${isScrolled || !isHome ? 'text-slate-800 dark:text-white' : 'text-white'}`}>
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* User Menu Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 divide-y divide-slate-100 dark:divide-slate-700 animate-in fade-in slide-in-from-top-2 duration-200 text-slate-800 dark:text-slate-100">
                    <div className="px-4 py-3">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/my-places"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 transition-colors"
                      >
                        <Building className="w-4 h-4" />
                        My Places
                      </Link>
                      <Link
                        to="/favorites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        Saved Places
                      </Link>
                      <Link
                        to="/state-explorer"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 transition-colors"
                      >
                        <Flag className="w-4 h-4 text-amber-500" />
                        India Explorer
                      </Link>
                      <Link
                        to="/trains"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 transition-colors"
                      >
                        <Train className="w-4 h-4 text-blue-500" />
                        Book Trains
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-700 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Console
                        </Link>
                      )}
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
                    isScrolled || !isHome
                      ? 'text-slate-700 dark:text-slate-200 hover:text-emerald-600'
                      : 'text-white hover:text-emerald-200'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border ${
                isScrolled || !isHome
                  ? 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 bg-white dark:bg-slate-800'
                  : 'border-white/30 text-amber-300 bg-white/10'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border ${
                isScrolled || !isHome
                  ? 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white bg-white dark:bg-slate-800'
                  : 'border-white/30 text-white bg-white/10'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl px-4 pt-4 pb-6 mt-3 space-y-4 animate-in slide-in-from-top duration-300 text-slate-800 dark:text-slate-100">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 py-2 border-b border-slate-100 dark:border-slate-800"
          >
            Explore Places
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/places/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400 py-2 border-b border-slate-100 dark:border-slate-800"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Place
              </Link>
              <Link
                to="/my-places"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 py-2 border-b border-slate-100 dark:border-slate-800"
              >
                My Places
              </Link>
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 py-2 border-b border-slate-100 dark:border-slate-800"
              >
                <span>Saved Favorites</span>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </Link>
              <Link
                to="/state-explorer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 py-2 border-b border-slate-100 dark:border-slate-800"
              >
                <span>India Explorer</span>
                <Flag className="w-4 h-4 text-amber-500" />
              </Link>
              <Link
                to="/trains"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 py-2 border-b border-slate-100 dark:border-slate-800"
              >
                <span>Book Trains</span>
                <Train className="w-4 h-4 text-blue-500" />
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 py-2 border-b border-slate-100 dark:border-slate-800"
              >
                My Profile
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400 py-2 border-b border-slate-100 dark:border-slate-800"
                >
                  <Shield className="w-4 h-4" />
                  Admin Console
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold py-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center font-semibold py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center font-semibold py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
