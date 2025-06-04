
import React from "react";
import MasterLayout from "../../../components/dashboard-components/MasterLayout";
import Breadcrumb from "../../../components/dashboard-components/Breadcrumb";
import CarBrandDisplay from "../../../components/dashboard-components/product/CarBrands";

const CarBrandListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Car Barnds" />

        {/* TableDataLayer */}
        <CarBrandDisplay />

      </MasterLayout>

    </>
  );
};

export default CarBrandListPage; 
