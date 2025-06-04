
import React from "react";
import MasterLayout from "../../../components/dashboard-components/MasterLayout";
import Breadcrumb from "../../../components/dashboard-components/Breadcrumb";
import CarCategoryList from "../../../components/dashboard-components/product/CarCategoryList";

const carPartCategoryPages = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Car Part Category" />

        {/* TableDataLayer */}
        <CarCategoryList />

      </MasterLayout>

    </>
  );
};

export default carPartCategoryPages; 
