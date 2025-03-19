import React, { useEffect, useState } from "react";
import HeaderFive from "../components/HeaderFive";
// import HeroSix from "../components/HeroSix";
import HeroFive from "../components/HeroFive";
// import CarBrands from "../components/CarBrands";
// import FeatureArea from "../components/FeatureArea"
import CategoryAreaOne from "../components/CategoryAreaOne";
// import ProductAreaOne from "../components/ProductAreaOne";
// import CTAAreaTwo from "../components/CTAAreaTwo";
import ProductAreaTwo from "../components/ProductAreaTwo";
import FaqAreaThree from "../components/FaqAreaThree";
import ClientAreaFour from "../components/ClientAreaFour";
import BlogAreaTwo from "../components/BlogAreaTwo";
// import SubscribeTwo from "../components/SubscribeTwo";
import FooterAreaFour from "../components/FooterAreaFour";
import Preloader from "../helper/Preloader";
// import ServiceAreaThree from "../components/ServiceAreaThree";
import TestimonialOne from "../components/TestimonialOne";

// import CategoriesSection from "../components/CategoriesSection";
import CurrentOffers from "../components/CurrentOffersSection";

import SearchVehicleArea from "../components/SearchVehicleArea"

const HomePageSix = () => {
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

      {/* Header Five */}
      <HeaderFive />

      {/* Hero Six */}
      <HeroFive />
      {/* featur section  */}
      {/* <FeatureArea /> */}

      {/* search filters  */}
      <SearchVehicleArea />

      {/* Category Area One */}
      <CategoryAreaOne />

      {/* Product Area One */}
      <ProductAreaTwo />
      {/* <ProductAreaOne /> */}

      {/* CTA Area Two */}
      {/* <CTAAreaTwo /> */}

      {/* <CategoriesSection /> */}

      {/* Product Area Two */}
      {/* <div className="brands">
      <CarBrands />
      </div> */}

      <CurrentOffers />


      {/* Faq Area three */}
      <FaqAreaThree />

      {/* Client Area Four */}
      <ClientAreaFour />

      <TestimonialOne />

      {/* Blog Area Two */}
      <div className="space-top">
        <BlogAreaTwo />
      </div>

      {/* Subscribe Two */}
      {/* <SubscribeTwo /> */}

      {/* Footer Area Four */}
      <FooterAreaFour />
    </>
  );
};

export default HomePageSix;
