import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
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

  const navigationItems = [
    { path: '/', name: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/crops', name: 'Crops', icon: 'Wheat' },
    { path: '/tasks', name: 'Tasks', icon: 'CheckSquare' },
    { path: '/finances', name: 'Finances', icon: 'DollarSign' },
    { path: '/weather', name: 'Weather', icon: 'Cloud' },
    { path: '/irrigation', name: 'Irrigation', icon: 'Droplets' },
    { path: '/farms', name: 'Farms', icon: 'Home' },
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-3" onClick={() => setSidebarOpen(false)}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                <ApperIcon name="Sprout" className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FarmTrack Pro</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath(item.path)
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            {user && (
              <div className="mb-3">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName || user.name || 'User'}
                </p>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              icon="LogOut"
              className="w-full justify-center"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Top Header for Desktop (User Info) */}
      <div className="hidden lg:block fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex justify-end items-center">
          {user && (
            <span className="text-sm text-gray-700">
              Welcome, {user.firstName || user.name || 'User'}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
