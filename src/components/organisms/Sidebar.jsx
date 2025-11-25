import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className = "" }) => {
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
return (
    <div className={cn("bg-primary-900 text-white", className)}>
      {/* Logo */}
      <div className="p-6 border-b border-primary-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Plane" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">SkyOps</h1>
            <p className="text-xs text-primary-300">Operations Management</p>
          </div>
        </div>
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
  );
};

export default Sidebar;