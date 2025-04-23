import React from "react";

import MasterLayout from "components/dashboard-components/MasterLayout";
import Breadcrumb from "components/dashboard-components/Breadcrumb";
import AddProduct from "components/dashboard-components/product/AddProduct";

const AddProductPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>
        <Breadcrumb title="Add Products" />
        <AddProduct />
      </MasterLayout>

    </>
  );
};

export default AddProductPage;
