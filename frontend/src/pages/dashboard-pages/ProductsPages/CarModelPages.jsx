
import React from "react";
import MasterLayout from "../../../components/dashboard-components/MasterLayout";
import Breadcrumb from "../../../components/dashboard-components/Breadcrumb";
import CarModelsDisplay from "../../../components/dashboard-components/product/CarModelsList";

const CarModelListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Car Models" />

        {/* TableDataLayer */}
        <CarModelsDisplay />

      </MasterLayout>

    </>
  );
};

export default CarModelListPage; 
