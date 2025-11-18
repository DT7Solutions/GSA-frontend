import React from "react";
import MasterLayout from "components/dashboard-components/MasterLayout";
import Breadcrumb from "components/dashboard-components/Breadcrumb";
import CustomerList from  "components/dashboard-components/Users/CustomerList";

const CustomerListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Customer List" />
        {/* TableDataLayer */}
        <CustomerList />

      </MasterLayout>

    </>
  );
};

export default CustomerListPage; 