import React, { useEffect, useState } from "react";
import Register from "../components/Register";
// import Preloader from "../helper/Preloader";

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
      {/* {active === true && <Preloader />} */}
      <Register />
    </>
  );
};

export default RegisterPage;
