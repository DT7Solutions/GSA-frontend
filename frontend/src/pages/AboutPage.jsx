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
import CounterOne from "components/CounterOne";
import Aboutbreadcrumb from "components/Aboutbreadcrumb";

const AboutPage = () => {
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

     <Aboutbreadcrumb/>
        
      {/* About Area */}
      <AboutTwo />
     

      {/* Process Area One */}
 
      {/* CTA Area One */}
      
    
      {/* Testimonial One */}
      <TestimonialOne />

      {/* Team Area Two */}
      {/* <TeamAreaTwo /> */}


      {/* Footer Area One */}
      <FooterAreaFour />
    </>
  );
};

export default AboutPage;
