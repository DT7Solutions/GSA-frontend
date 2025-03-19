import React, { useEffect, useState } from "react";
import HeaderFive from "../components/HeaderFive";

import FooterAreaFour from "../components/FooterAreaFour";
import Breadcrumb from "../components/Breadcrumb";
import SubscribeOne from "../components/SubscribeOne";
import ShopDetails from "../components/ShopDetails";
import Preloader from "../helper/Preloader";

const ShopDetailsPage = () => {
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

      {/* Header one */}
      <HeaderFive />

      {/* Breadcrumb */}
      <Breadcrumb title={"Shop Details"} />

      {/* Shop Details */}
      <ShopDetails />

      {/* Subscribe One */}
      <SubscribeOne />

      {/* Footer Area One */}
      <FooterAreaFour />
    </>
  );
};

export default ShopDetailsPage;
