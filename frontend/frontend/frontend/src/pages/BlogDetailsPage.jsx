import React, { useEffect, useState } from "react";
import HeaderFive from "../components/HeaderFive";
import FooterAreaFour from "../components/FooterAreaFour";
import Breadcrumb from "../components/Breadcrumb";
import SubscribeOne from "../components/SubscribeOne";
import BlogDetails from "../components/BlogDetails";
import Preloader from "../helper/Preloader";

const BlogDetailsPage = () => {
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

      Header one
      <HeaderFive />

      {/* Breadcrumb */}
      <Breadcrumb title={"Blog Details"} />

      {/* Blog Details */}
      <BlogDetails />

      {/* Subscribe One */}
      <SubscribeOne />

      {/* Footer Area One */}
      <FooterAreaFour />
    </>
  );
};

export default BlogDetailsPage;
