
import React from "react";
import MasterLayout from "../../../components/dashboard-components/MasterLayout";
import Breadcrumb from "../../../components/dashboard-components/Breadcrumb";
import CarPartList from "../../../components/dashboard-components/product/CarPartList";

const carPartGroupPages = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Car Part Group" />

        {/* TableDataLayer */}
        <CarPartList />

      </MasterLayout>

    </>
  );
};

export default carPartGroupPages; 
