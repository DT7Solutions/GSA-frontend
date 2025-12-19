import React, { useEffect, useState } from "react";
import LogIn from "../components/LogIn";
// import Preloader from "../helper/Preloader";

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
      {/* {active === true && <Preloader />} */}
      <LogIn />
    </>
  );
};

export default LoginPage;
