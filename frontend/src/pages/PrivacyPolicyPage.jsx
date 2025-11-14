import React, { useEffect, useState } from "react";
import HeaderFive from "../components/HeaderFive";

import FooterAreaFour from "../components/FooterAreaFour";
import Breadcrumb from "../components/Breadcrumb";
import PrivacyPolicySection from "../components/PrivacyPolicySection";
import Preloader from "../helper/Preloader";

const PrivacyPolicyPage = () => {
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
      <Breadcrumb statictitle={"Privacy Policy"} />

      <PrivacyPolicySection />
      
      <FooterAreaFour />
    </>
  );
};

export default PrivacyPolicyPage;
