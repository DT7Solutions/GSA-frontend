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

      {/* Breadcrumb */}
      <Breadcrumb title={"About Us"} />

      {/* About Area */}
      <AboutTwo />

      {/* Process Area One */}
 
      {/* CTA Area One */}
      <CTAAreaTwo />

      {/* Testimonial One */}
      <TestimonialOne />

      {/* Team Area Two */}
      {/* <TeamAreaTwo /> */}

      {/* Subscribe One */}
      <SubscribeOne />

      {/* Footer Area One */}
      <FooterAreaFour />
    </>
  );
};

export default AboutPage;
