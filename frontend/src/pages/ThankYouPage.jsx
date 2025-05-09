import React, { useEffect, useState } from "react";
import HeaderFive from "../components/HeaderFive";

import FooterAreaFour from "../components/FooterAreaFour";
import Thankyou from "../components/Thankyou.jsx";
import Preloader from "../helper/Preloader";

const ThankyouPage = () => {
    
  
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

      <Thankyou />
      
      <FooterAreaFour />
    </>
  );
};

export default ThankyouPage;
