import React from "react";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";

const MarqueeOne = () => {
  return (
    <div className=" bg-smoke">
      <div className="container-fluid p-0 overflow-hidden">
        <div className="slider__marquee">
          <div className="marquee_mode">
            <Marquee pauseOnHover={true} style={{ backgroundColor: '#0068a5' }}>
              <div className="item">
                <Link to="#" style={{ color: 'white' }}>
                  <span>🚗 Your One-Stop Service Corner for All Car Needs — 🔧 Authorized Hyundai, Toyota & Ford Dealers in Guntur</span>
                </Link>
              </div>
              <div className="item">
                <Link to="#" style={{ color: 'white' }}>
                  <span>🚗 Your One-Stop Service Corner for All Car Needs — 🔧 Authorized Hyundai, Toyota & Ford Dealers in Guntur</span>
                </Link>
              </div>
              <div className="item">
                <Link to="#" style={{ color: 'white' }}>
                  <span>🚗 Your One-Stop Service Corner for All Car Needs — 🔧 Authorized Hyundai, Toyota & Ford Dealers in Guntur</span>
                </Link>
              </div>
              <div className="item">
                <Link to="#" style={{ color: 'white' }}>
                  <span>🚗 Your One-Stop Service Corner for All Car Needs — 🔧 Authorized Hyundai, Toyota & Ford Dealers in Guntur</span>
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