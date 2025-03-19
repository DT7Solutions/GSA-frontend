import React from "react";

const FeatureAreaOne = () => {
  return (
    <div className="feature-area-1">
      <div className="container">
        <div className="row gy-4 justify-content-center">
          <div className="col-xl-4">
            <div className="single-feature-wrap">
              <div className="thumb">
                <img src="assets/img/intro/01.png" alt="Fixturbo" />
              </div>
              <div className="media-body">
                <h4>Free Delivery</h4>
                <p>Home delivery, free shipping!</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="single-feature-wrap">
              <div className="thumb">
                <img src="assets/img/intro/02.png" alt="Fixturbo" />
              </div>
              <div className="media-body">
                <h4>Moneyback Guarantee</h4>
                <p>Always make sure your money!</p>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="single-feature-wrap">
              <div className="thumb">
                <img src="assets/img/intro/03.png" alt="Fixturbo" />
              </div>
              <div className="media-body">
                <h4>24/7 Online Support</h4>
                <p>We always listen your questions!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureAreaOne;
