
import React from "react";
import MasterLayout from "../../../components/dashboard-components/MasterLayout";
import Breadcrumb from "../../../components/dashboard-components/Breadcrumb";
import ProductListDisplay from "../../../components/dashboard-components/product/ProductListDisplay";

const ProductListDisplayPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Basic Table" />

        {/* TableDataLayer */}
        <ProductListDisplay />

      </MasterLayout>

    </>
  );
};

export default ProductListDisplayPage; 
