import React, { useEffect, useState } from "react";
import HeaderFive from "../components/HeaderFive";

import FooterAreaFour from "../components/FooterAreaFour";
import Breadcrumb from "../components/Breadcrumb";
import TermsAndConditionsSection from "../components/TermsAndConditionsSection";
import Preloader from "../helper/Preloader";

const TermsAndConditionsPage = () => {
  let [active, setActive] = useState(true);
  useEffect(() => {
    setTimeout(function () {
      setActive(false);
    }, 2000);
  }, []);
  return (
    <>
      {/* Preloader */}
      {active === true && <Preloader />}
      <HeaderFive />
      <Breadcrumb title={"Terms And Conditions"} />

      <TermsAndConditionsSection />
      
      <FooterAreaFour />
    </>
  );
};

export default TermsAndConditionsPage;
