import React from "react";
import MasterLayout from "../../components/dashboard-components/MasterLayout";
import Breadcrumb from "../../components/dashboard-components/Breadcrumb";
import DashBoardLayer from "../../components/dashboard-components/child/DashBoardHero";

const LandinPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="AI" />


        {/* DashBoardLayerOne */}
        <DashBoardLayer />

      </MasterLayout>
    </>
  );
};

export default LandinPage;
