import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import TableDataLayer from "../../../components/dashboard-components/child/TableDataLayer";

const TableDataPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Basic Table" />

        {/* TableDataLayer */}
        <TableDataLayer />

      </MasterLayout>

    </>
  );
};

export default TableDataPage; 
