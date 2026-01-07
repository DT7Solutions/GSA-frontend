import React from "react";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";

const CounterTwo = () => {
  return (
    <div className="container">
      <div className="counter-area-2 ">
        <div className="row gy-40 justify-content-between">
          <div className="col-sm-6 col-lg-auto">
            <div className="counter-card style2">
              <div className="media-body">
                <h2 className="counter-card_number">
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className="counter-number text-theme">
                          <CountUp delay={0} start={0} end={29} />+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h2>
                <p className="counter-card_text text-dark">Years of Experience</p>
              </div>
            </div>
          </div>
         
          <div className="col-sm-6 col-lg-auto">
            <div className="counter-card style2">
              <div className="media-body">
                <h2 className="counter-card_number">
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className="counter-number text-theme">
                          <CountUp delay={0} start={0} end={50000} />+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h2>
                <p className="counter-card_text text-dark">Parts in Stock</p>
              </div>
            </div>
          </div>
          
          <div className="col-sm-6 col-lg-auto">
            <div className="counter-card style2">
              <div className="media-body">
                <h2 className="counter-card_number">
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className="counter-number text-theme">
                          <CountUp delay={0} start={0} end={10000} />+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h2>
                <p className="counter-card_text text-dark">Happy Customers</p>
              </div>
            </div>
          </div>
         
          <div className="col-sm-6 col-lg-auto">
            <div className="counter-card style2">
              <div className="media-body">
                <h2 className="counter-card_number">
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className="counter-number text-theme">
                          <CountUp delay={0} start={0} end={100} />+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h2>
                <p className="counter-card_text text-dark">Brands Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterTwo;