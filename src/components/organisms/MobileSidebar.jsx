import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const MobileSidebar = ({ isOpen, onClose, className = "" }) => {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Event Calendar", href: "/event-calendar", icon: "Calendar" },
    { name: "Work Calendar", href: "/work-calendar", icon: "CalendarClock" },
    { name: "Users", href: "/users", icon: "Users" },
    { name: "Roles", href: "/roles", icon: "Shield" },
    { name: "Drop Zones", href: "/drop-zones", icon: "MapPin" },
    { name: "Settings", href: "/settings", icon: "Settings" },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-80 bg-primary-900 text-white transform transition-transform duration-300 ease-out translate-x-0",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Plane" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SkyOps</h1>
              <p className="text-xs text-primary-300">Operations Management</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-300 hover:text-white hover:bg-primary-800"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = item.href === "/" 
                ? location.pathname === "/" 
                : location.pathname.startsWith(item.href);
              
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg border-l-4 border-amber-400"
                        : "text-primary-200 hover:bg-primary-800 hover:text-white hover:border-l-4 hover:border-sky-400"
                    )}
                  >
                    <ApperIcon 
                      name={item.icon} 
                      className={cn(
                        "w-5 h-5 mr-3 transition-colors duration-200",
                        isActive ? "text-white" : "text-primary-300 group-hover:text-sky-300"
                      )} 
                    />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-primary-800">
          <div className="text-center text-xs text-primary-400">
            <p>© 2024 SkyOps</p>
            <p>Aviation Operations Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;