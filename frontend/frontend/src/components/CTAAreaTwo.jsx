import React from "react";

const CTAAreaTwo = () => {
  return (
    <div className="cta-area-2">
      <div className="container">
        <div className="cta-wrap2 bg-theme">
          <div className="row justify-content-md-between align-items-center">
            <div className="col-lg-7">
              <div className="title-area">
                <h2 className="sec-title text-white">
                  Subscribe To Stay Connected
                </h2>
                <p className="sec-text text-white">
                  A car repair is a service provided to fix any issues or
                  damages with vehicle. It a involves diagnosing the problem,
                  repairing o necessary parts
                </p>
              </div>
              <form className="newsletter-form style2">
                <div className="form-group">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Your Email Address"
                    required=""
                  />
                </div>
                <button type="submit" className="btn style5">
                  SUBSCRIBE
                </button>
              </form>
            </div>
            <div className="col-lg-5">
              <div className="cta2-bg-thumb">
                <img src="assets/img/normal/cta-thumb-2-1.png" alt="Fixturbo"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAAreaTwo;
