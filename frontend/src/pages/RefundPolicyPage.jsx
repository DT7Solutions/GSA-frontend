import React, { useEffect, useState } from "react";
import HeaderFive from "../components/HeaderFive";

import FooterAreaFour from "../components/FooterAreaFour";
import Breadcrumb from "../components/Breadcrumb";
import RefundPolicy from "../components/RefundPolicy";
import Preloader from "../helper/Preloader";

const RefundPolicyPage = () => {
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
      <Breadcrumb title={"Refund Policy"} />

      <RefundPolicy />
      
      <FooterAreaFour />
    </>
  );
};

export default RefundPolicyPage;
