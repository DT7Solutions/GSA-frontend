import React from "react";
import MasterLayout from "components/dashboard-components/MasterLayout";
import Breadcrumb from "components/dashboard-components/Breadcrumb";
import EnquiryList from "components/dashboard-components/enquirys/EnquiryList";

const Enquiryformpages = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Enquiry Form" />

        {/* TableDataLayer */}
        <EnquiryList />

      </MasterLayout>

    </>
  );
};

export default Enquiryformpages; 