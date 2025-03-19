import React from "react";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
const CounterTwo = () => {
  return (
    <div className="container">
      <div className="counter-area-2 bg-theme">
        <div className="row gy-40 justify-content-between">
          <div className="col-sm-6 col-lg-auto">
            <div className="counter-card style2">
              <div className="counter-card_icon">
                <img src="assets/img/icon/counter-icon_2-1.svg" alt="Fixturbo" />
              </div>
              <div className="media-body">
                <h2 className="counter-card_number">
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className="counter-number">
                          <CountUp delay={0} start={0} end={2540} />+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h2>
                <p className="counter-card_text">Project Done</p>
              </div>
            </div>
          </div>
          <div className="col-xl-auto d-xl-block d-none">
            <div className="counter-divider" />
          </div>
          <div className="col-sm-6 col-lg-auto">
            <div className="counter-card style2">
              <div className="counter-card_icon">
                <img src="assets/img/icon/counter-icon_2-2.svg" alt="Fixturbo" />
              </div>
              <div className="media-body">
                <h2 className="counter-card_number">
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className="counter-number">
                          <CountUp delay={0} start={0} end={100} />+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h2>
                <p className="counter-card_text">Project Win</p>
              </div>
            </div>
          </div>
          <div className="col-xl-auto d-xl-block d-none">
            <div className="counter-divider" />
          </div>
          <div className="col-sm-6 col-lg-auto">
            <div className="counter-card style2">
              <div className="counter-card_icon">
                <img src="assets/img/icon/counter-icon_2-3.svg" alt="Fixturbo" />
              </div>
              <div className="media-body">
                <h2 className="counter-card_number">
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className="counter-number">
                          <CountUp delay={0} start={0} end={10} />+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h2>
                <p className="counter-card_text">Glorious Years</p>
              </div>
            </div>
          </div>
          <div className="col-xl-auto d-xl-block d-none">
            <div className="counter-divider" />
          </div>
          <div className="col-sm-6 col-lg-auto">
            <div className="counter-card style2">
              <div className="counter-card_icon">
                <img src="assets/img/icon/counter-icon_2-4.svg" alt="Fixturbo" />
              </div>
              <div className="media-body">
                <h2 className="counter-card_number">
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className="counter-number">
                          <CountUp delay={0} start={0} end={8255} />+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h2>
                <p className="counter-card_text">Active Clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterTwo;
