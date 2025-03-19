import React, { useState } from "react";
import Sidebar from "./layouts/Sidebar";
import Navbar from "./layouts/Navbar";
import MainContent from "./layouts/MainContent";


const DashboardPage = () => {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="app">
      <Sidebar onMenuSelect={setPage} />
      <div className="main-layout">
        <Navbar />
        <MainContent page={page} />
      </div>
    </div>
  );
};

export default DashboardPage;
