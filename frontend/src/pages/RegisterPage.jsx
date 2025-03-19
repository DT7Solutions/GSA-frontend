import React, { useEffect, useState } from "react";
// import HeaderFive from "../components/HeaderFive";

// import FooterAreaFour from "../components/FooterAreaFour";
// import Breadcrumb from "../components/Breadcrumb";
// import SubscribeOne from "../components/SubscribeOne";
import Register from "../components/Register";
import Preloader from "../helper/Preloader";

const RegisterPage = () => {
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
      {/* <HeaderFive /> */}
      {/* Breadcrumb */}
      {/* <Breadcrumb title={"Cart"} /> */}

      {/* Cart */}
      <Register />

      {/* <FooterAreaFour /> */}
    </>
  );
};

export default RegisterPage;
