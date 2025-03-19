import React from "react";
import { Link } from "react-router-dom";

const SubscribeTwo = () => {
  return (
    <div className="container">
      <div className="footer-top-3">
        <div className="footer-logo">
          <Link to="/">
            <img src="assets/img/logo-white.svg" alt="Fixturbo" />
          </Link>
        </div>
        <h3 className="footer-top-title text-white">
          Subscribe our newsletter for updates
        </h3>
        <form className="newsletter-form">
          <div className="form-group">
            <input
              className="form-control"
              type="email"
              placeholder="Your Email Address"
              required=""
            />
          </div>
          <button type="submit" className="btn style5">
            <i className="fas fa-arrow-right" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscribeTwo;
