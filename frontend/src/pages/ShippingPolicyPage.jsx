import React, { useEffect, useState } from "react";
import HeaderFive from "../components/HeaderFive";

import FooterAreaFour from "../components/FooterAreaFour";
import Breadcrumb from "../components/Breadcrumb";
import ShippingPolicy from "../components/ShippingPolicy";
import Preloader from "../helper/Preloader";

const ShippingPolicyPage = () => {
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
      <Breadcrumb title={"Shipping Policy"} />

      <ShippingPolicy />
      
      <FooterAreaFour />
    </>
  );
};

export default ShippingPolicyPage;
