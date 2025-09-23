import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Finances from "@/components/pages/Finances";
import Tasks from "@/components/pages/Tasks";
import Dashboard from "@/components/pages/Dashboard";
import Weather from "@/components/pages/Weather";
import Crops from "@/components/pages/Crops";
import Button from "@/components/atoms/Button";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                <ApperIcon name="Sprout" className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FarmTrack Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath('/') 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/crops"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath('/crops') 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Crops
            </Link>
            <Link
              to="/tasks"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath('/tasks') 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Tasks
            </Link>
            <Link
              to="/finances"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath('/finances') 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Finances
            </Link>
            <Link
              to="/weather"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActivePath('/weather') 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Weather
            </Link>
          </nav>

          {/* User Menu & Logout */}
          <div className="flex items-center space-x-4">
            {user && (
              <span className="hidden sm:block text-sm text-gray-700">
                Welcome, {user.firstName || user.name || 'User'}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              icon="LogOut"
            >
              Logout
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActivePath('/') 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/crops"
                className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActivePath('/crops') 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                Crops
              </Link>
              <Link
                to="/tasks"
                className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActivePath('/tasks') 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                Tasks
              </Link>
              <Link
                to="/finances"
                className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActivePath('/finances') 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                Finances
              </Link>
              <Link
                to="/weather"
                className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActivePath('/weather') 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                Weather
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
);
};

export default Header;