import React from "react";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
const AboutTwo = () => {
  return (
    <div className="space-top">
      <div className="container">
        <div className="row">
          <div className="col-xxl-7 col-xl-6">
            <div className="about-thumb2 mb-40 mb-xl-0">
              <div className="about-img-1">
                <img src={`${process.env.PUBLIC_URL}assets/img/normal/about_2-1.png`} alt="GSA" />
              </div>
              <div className="about-img-2">
                <img src={`${process.env.PUBLIC_URL}assets/img/normal/about_2-2.png`} alt="GSA" />
              </div>
              <div className="about-counter-wrap jump-reverse">
                <img src="assets/img/icon/about_icon2-1.svg" alt="GSA" />
                <h3 className="about-counter">
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className="counter-number">
                          <CountUp delay={0} start={0} end={5} />
                          k+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h3>
                <h4 className="about-counter-text">Trusted Customer</h4>
              </div>
              <div className="about-year-wrap2 movingX">
                <div className="about-year-grid-wrap">
                  <div className="icon">
                    <img src={`${process.env.PUBLIC_URL}assets/img/icon/about_icon2-2.png`} alt="GSA" />
                  </div>
                  <h3 className="about-counter">
                    <span className="counter-number">10</span>+
                  </h3>
                </div>
                <h4 className="about-year-text">Years Of Experiences</h4>
              </div>
            </div>
          </div>
          <div className="col-xxl-5 col-xl-6">
            <div className="about-content-wrap">
              <div className="title-area mb-30">
                <span className="sub-title">Know About Us</span>
                <h2 className="sec-title">
                 Trusted Auto Body Parts Dealer in Guntur{" "}
                  <img
                    className="title-bg-shape shape-center"
                    src="assets/img/bg/title-bg-shape.png"
                    alt="GSA"
                  />
                </h2>
                <p className="sec-text">
                  Gowrisankar Agencies is an authorized dealer for Hyundai and Toyota auto body parts in Guntur. We specialize in supplying high-quality, genuine components for both brands, ensuring perfect fit and performance. From bumpers and lights to mirrors and doors, we stock a wide range of parts for various models. With a commitment to quality, competitive pricing, and expert customer service, we have become a trusted name among car owners and workshops. Whether you need a replacement part or a full body solution, Gowrisankar Agencies is your go-to destination for reliable Hyundai and Toyota body parts in Guntur.
                </p>
              </div>
              {/* <div className="about-feature-wrap style-shadow">
                <div className="icon">
                  <img src="assets/img/icon/about_icon2-3.svg" alt="GSA" />
                </div>
                <div className="about-feature-wrap-details">
                  <h5 className="about-feature-title">
                    Elite Automotive Service
                  </h5>
                  <p className="about-feature-text">
                    Et purus duis sollicitudin dignissim habitant. Egestas nulla
                    quis venenatis cras sed{" "}
                  </p>
                </div>
              </div> 
              <div className="about-feature-wrap style-shadow">
                <div className="icon">
                  <img src="assets/img/icon/about_icon2-4.svg" alt="GSA" />
                </div>
                <div className="about-feature-wrap-details">
                  <h5 className="about-feature-title">Pro Drive Garage</h5>
                  <p className="about-feature-text">
                    Et purus duis sollicitudin dignissim habitant. Egestas nulla
                    quis venenatis cras sed{" "}
                  </p>
                </div>
              </div>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTwo;
