import React from "react";

const MainContent = ({ page }) => {
  return (
    <div className="content">
      {page === "dashboard" && <h2>Dashboard Overview</h2>}
      {page === "reports" && <h2>Reports Section</h2>}
      {page === "profile" && <h2>User Profile</h2>}
    </div>
  );
};

export default MainContent;
