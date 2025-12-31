import React, { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="impl_top_icon">
      {isVisible && (
        <button id="button" onClick={scrollToTop} className="show">
          <span>
            <img
              src="/assets/img/client/scroll-to-top.png"
              className="img-fluid"
              alt="Go to top"
            />
          </span>
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;
