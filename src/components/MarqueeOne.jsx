import React from "react";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
const MarqueeOne = () => {
  return (
    <div className="space bg-smoke">
      <div className="container-fluid p-0 overflow-hidden">
        <div className="slider__marquee">
          <div className="marquee_mode">
            <Marquee>
              <div className="item">
                <Link to="#">
                  <img
                    src="assets/img/icon/marquee-icon-1-1.svg"
                    alt="Fixturbo"
                  />
                  <span>Express Car Fix</span>
                </Link>
              </div>
              <div className="item">
                <Link to="#">
                  <img
                    src="assets/img/icon/marquee-icon-1-2.svg"
                    alt="Fixturbo"
                  />
                  <span className="text-stroke">Car Care Clinic</span>
                </Link>
              </div>
              <div className="item">
                <Link to="#">
                  <img
                    src="assets/img/icon/marquee-icon-1-1.svg"
                    alt="Fixturbo"
                  />
                  <span>Express Car Fix</span>
                </Link>
              </div>
              <div className="item">
                <Link to="#">
                  <img
                    src="assets/img/icon/marquee-icon-1-2.svg"
                    alt="Fixturbo"
                  />
                  <span className="text-stroke">Car Care Clinic</span>
                </Link>
              </div>
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarqueeOne;
