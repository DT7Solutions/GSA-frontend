import React from "react";

import MasterLayout from "components/dashboard-components/MasterLayout";
import Breadcrumb from "components/dashboard-components/Breadcrumb";
import UpdateProductsForm from "components/dashboard-components/product/update-product-form";

const UpdateProductsFormPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>
        <Breadcrumb title="Add Products" />
        <UpdateProductsForm />
      </MasterLayout>

    </>
  );
};

export default UpdateProductsFormPage;
