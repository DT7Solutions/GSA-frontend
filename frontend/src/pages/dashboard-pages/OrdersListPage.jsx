
import React from "react";
import MasterLayout from "../../components/dashboard-components/MasterLayout";
import Breadcrumb from "../../components/dashboard-components/Breadcrumb";
import OrdersList from "../../components/dashboard-components/Orders/OrdersList";

const TableDataPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Basic Table" />

        {/* TableDataLayer */}
        <OrdersList />

      </MasterLayout>

    </>
  );
};

export default TableDataPage; 
