import React, { useEffect, useState } from "react";
import HeaderFive from "../components/HeaderFive";

import FooterAreaFour from "../components/FooterAreaFour";
import Breadcrumb from "../components/Breadcrumb";
import AboutTwo from "../components/AboutTwo";

import CTAAreaTwo from "../components/CTAAreaTwo";
import TestimonialOne from "../components/TestimonialOne";
import SubscribeOne from "../components/SubscribeOne";
// import TeamAreaTwo from "../components/TeamAreaTwo";
import Preloader from "../helper/Preloader";
import CustomerOrdersList from "../components/CustomerOrdersList";

const ViewCustomerOrdersPage = () => {
  let [active, setActive] = useState(true);
  useEffect(() => {
    setTimeout(function () {
      setActive(false);
    }, 2000);
  }, []);
  return (
    <>

      {active === true && <Preloader />}
      <HeaderFive />

      <Breadcrumb title={"Orders list"} />

      <CustomerOrdersList />

      <FooterAreaFour />
    </>
  );
};

export default ViewCustomerOrdersPage;
