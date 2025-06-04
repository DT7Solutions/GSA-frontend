
import React from "react";
import MasterLayout from "../../../components/dashboard-components/MasterLayout";
import Breadcrumb from "../../../components/dashboard-components/Breadcrumb";
import CarModelVariants from "../../../components/dashboard-components/product/CarModelVariants";

const CarVariantListPages = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Car Variant" />

        {/* TableDataLayer */}
        <CarModelVariants />

      </MasterLayout>

    </>
  );
};

export default CarVariantListPages; 
