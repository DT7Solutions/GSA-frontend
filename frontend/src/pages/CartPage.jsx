import React, { useEffect, useState } from "react";
import HeaderFive from "../components/HeaderFive";

import FooterAreaFour from "../components/FooterAreaFour";
import Breadcrumb from "../components/Breadcrumb";
import SubscribeOne from "../components/SubscribeOne";
import Cart from "../components/Cart";
import Preloader from "../helper/Preloader";

const CartPage = () => {
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
      <Breadcrumb statictitle={"Cart"} />

      <Cart />
      
      <FooterAreaFour />
    </>
  );
};

export default CartPage;
