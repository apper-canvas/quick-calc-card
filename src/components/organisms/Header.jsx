import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, className = "" }) => {
  return (
    <header className={`bg-white border-b border-slate-200 ${className}`}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="text-slate-600 hover:text-slate-800"
          >
            <ApperIcon name="Menu" className="w-6 h-6" />
          </Button>
        </div>

        {/* Page Title - Hidden on Mobile */}
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-slate-800 gradient-text">
            Skydiving Operations Management
          </h1>
        </div>

        {/* Mobile Title */}
        <div className="lg:hidden flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Plane" className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800">SkyOps</span>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-600 hover:text-slate-800"
          >
            <ApperIcon name="Bell" className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-800">Admin User</p>
              <p className="text-xs text-slate-500">Super Administrator</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;