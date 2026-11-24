import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Heart, Globe, MapPin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-600 text-white">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Wanderlust
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Discover breathtaking destinations, hidden gems, and unforgettable travel experiences around the world.
            </p>
            <p className="text-emerald-400 text-sm font-semibold italic">
              "Discover places. Create memories."
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2.5 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Home Landing
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-emerald-400 transition-colors">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Beach" className="hover:text-emerald-400 transition-colors">
                  Beach Escapes
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Mountain" className="hover:text-emerald-400 transition-colors">
                  Mountain Adventures
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Cultural" className="hover:text-emerald-400 transition-colors">
                  Cultural Journeys
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Popular Regions
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/explore?search=Asia" className="hover:text-emerald-400 transition-colors">
                  Asia & Far East
                </Link>
              </li>
              <li>
                <Link to="/explore?search=Europe" className="hover:text-emerald-400 transition-colors">
                  Europe & Alps
                </Link>
              </li>
              <li>
                <Link to="/explore?search=India" className="hover:text-emerald-400 transition-colors">
                  Incredible India
                </Link>
              </li>
              <li>
                <Link to="/explore?search=Middle East" className="hover:text-emerald-400 transition-colors">
                  Middle East
                </Link>
              </li>
              <li>
                <Link to="/explore?search=Tropical" className="hover:text-emerald-400 transition-colors">
                  Islands & Tropics
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Newsletter
            </h3>
            <p className="text-slate-400 text-xs mb-3">
              Subscribe to get secret travel deals & destination guides.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-md"
              >
                Join Wanderlust Club
              </button>
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Wanderlust Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
