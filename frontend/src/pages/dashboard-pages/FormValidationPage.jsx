import React from "react";
import MasterLayout from "../../components/dashboard-components/MasterLayout";
import Breadcrumb from "../../components/dashboard-components/Breadcrumb";
import FormValidationLayer from "../../components/dashboard-components/child/FormValidationLayer";


const FormValidationPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Form Validation" />

        {/* FormValidationLayer */}
        <FormValidationLayer />

      </MasterLayout>

    </>
  );
};

export default FormValidationPage;
