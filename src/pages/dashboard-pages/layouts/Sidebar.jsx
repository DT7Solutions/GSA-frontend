import React, { useState } from "react";
import { FaBars, FaHome, FaChartBar, FaUser } from "react-icons/fa";
// import "./Sidebar.css"; 

const Sidebar = ({ onMenuSelect }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        <FaBars />
      </button>
      <ul className="mt-4">
        <li onClick={() => onMenuSelect("dashboard")}>
          <FaHome /> {!collapsed && "Dashboard"}
        </li>
        <li onClick={() => onMenuSelect("reports")}>
          <FaChartBar /> {!collapsed && "Reports"}
        </li>
        <li onClick={() => onMenuSelect("profile")}>
          <FaUser /> {!collapsed && "Profile"}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
