import React, { useEffect, useState } from "react";
import HeaderFive from "../components/HeaderFive";

import FooterAreaFour from "../components/FooterAreaFour";
import Breadcrumb from "../components/Breadcrumb";
import SubscribeOne from "../components/SubscribeOne";
import BrandModels from "../components/BrandModels";
import Preloader from "../helper/Preloader";

const BrandModelsPage = () => {
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

      <Breadcrumb title={"Brand Models"} />

  
      <BrandModels />


      {/* Footer Area One */}
      <FooterAreaFour />
    </>
  );
};

export default BrandModelsPage;
