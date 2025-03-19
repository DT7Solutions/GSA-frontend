import React from "react";
import { Link } from "react-router-dom";

const WhyChooseUsTwo = () => {
  return (
    <div className="about-area-1 space">
      <div className="about1-shape-img shape-mockup">
        <img
          className="about1-shape-img-1 spin"
          src="assets/img/normal/about_shape1-2.svg"
          alt="Fixturbo"
        />
        <img
          className="about1-shape-img-2 spin2"
          src="assets/img/normal/about_shape1-1.svg"
          alt="Fixturbo"
        />
      </div>
      <div className="container">
        <div className="row align-items-center justify-content-between flex-row-reverse">
          <div className="col-xl-6 text-xl-center">
            <div className="wcu-thumb-wrap mb-xl-0 mb-40">
              <img
                className="img-1"
                src="assets/img/normal/wcu-1.png"
                alt="Fixturbo"
              />
              <img
                className="img-2"
                src="assets/img/normal/wcu-2.png"
                alt="Fixturbo"
              />
            </div>
          </div>
          <div className="col-xxl-5 col-xl-6">
            <div className="about-content-wrap">
              <div className="title-area me-xl-5 mb-30">
                <span className="sub-title">WHY CHOOSE US</span>
                <h2 className="sec-title">Our Best Advantages</h2>
                <p className="sec-text">
                  Et purus duis sollicitudin dignissim habitant. Egestas nulla
                  quis venenatis cras sed eu massa eu faucibus. Urna fusce
                </p>
              </div>
              <div className="row gy-4 justify-content-md-between justify-content-end align-items-center flex-row-reverse">
                <div className="col-md-6">
                  <div className="checklist style2">
                    <ul>
                      <li>
                        <i className="fas fa-check-double" />
                        Low Price Guarantee
                      </li>
                      <li>
                        <i className="fas fa-check-double" />
                        Trained Technicians
                      </li>
                      <li>
                        <i className="fas fa-check-double" />
                        Life-Time Warranty
                      </li>
                      <li>
                        <i className="fas fa-check-double" />
                        Automated testing lanes
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6 col-lg-6">
                  <div className="checklist style2">
                    <ul>
                      <li>
                        <i className="fas fa-check-double" />
                        Quick Service Times
                      </li>
                      <li>
                        <i className="fas fa-check-double" />
                        Free Trade Appraisal
                      </li>
                      <li>
                        <i className="fas fa-check-double" />
                        Genuine spare parts
                      </li>
                      <li>
                        <i className="fas fa-check-double" />
                        Unbeatable savings!
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="btn-wrap mt-40">
                <Link to="/about" className="btn style2">
                  Read More <i className="fas fa-arrow-right ms-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsTwo;
