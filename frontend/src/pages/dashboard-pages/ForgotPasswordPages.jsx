import React, { useEffect, useState } from "react";
import ForgotPassword from "../../components/ForgotPassword";
import Preloader from "../helper/Preloader";

const LoginPage = () => {
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

      {/* Cart */}
      <ForgotPassword />
    </>
  );

};

export default LoginPage;
