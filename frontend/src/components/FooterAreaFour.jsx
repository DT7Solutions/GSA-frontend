import React from "react";
import { Link } from "react-router-dom";

const FooterAreaFour = () => {
  return (
    // <footer
    //   className="footer-wrapper footer-layout4"
    //   style={{ backgroundImage: "url(assets/img/bg/footer-bg2-1.png)" }}
    // >
       <footer
      className="footer-wrapper footer-layout4"
      
    >
      <div className="container">
        <div className="widget-area">
          <div className="row justify-content-between">
            <div className="col-md-6 col-xl-4">
              <div className="widget footer-widget widget-about">
                 <Link to="/" className="footer-logo ">
                                  <img src={`${process.env.PUBLIC_URL}/assets/img/footer-logo.png`} alt="Gowri Sankaragencies " className="footer-logo-img" />
                                </Link>
                {/* <h3 className="widget_title">About Us</h3> */}
                <p className="footer-text mb-30 mt-2">
                 A one stop service corner for all your car needs.
Authorised dealers for Hyundai, Toyota and Ford.
Available in Guntur
                </p>
                <div className="social-btn style3">
                  <Link to="https://www.instagram.com/gowrisankaragencies/" tabIndex={-1}>
                    <i className="fab fa-instagram" />
                  </Link>
                  <Link to="https://www.facebook.com/gowrisankaragencies" tabIndex={-1}>
                    <i className="fab fa-facebook-f" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-2">
              <div className="widget widget_nav_menu footer-widget">
                <h3 className="widget_title">Company</h3>
                <div className="menu-all-pages-container">
                  <ul className="menu">
                    <li>
                      <Link to="/about-us">About</Link>
                    </li><li>
                      <Link to="/contact-us">Contact us</Link>
                    </li>
                   
                  
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="widget widget_nav_menu footer-widget">
                <h3 className="widget_title">Legal Links</h3>
                <div className="menu-all-pages-container">
                  <ul className="menu">
                    <li>
                      <Link to="/privacy-policy">Privacy Policy</Link>
                    </li>
                    <li>
                      <Link to="/terms-and-conditions">Terms and Conditions</Link>
                    </li>
                    <li>
                      <Link to="/refund-policy">Refund Policy</Link>
                    </li>
                    <li>
                      <Link to="/shipping-policy">Shipping Policy </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="widget footer-widget">
                <h3 className="widget_title">Contact</h3>
                <div className="widget-contact2">
                  <div className="widget-contact-grid">
                    <div className="icon">
                      <i className="fas fa-map-marker-alt" />
                    </div>
                    <div className="contact-grid-details">
                      <p>Address</p>
                      <h6>
                         PLOT NO.381,PHASE 1&2,INDIRA AUTONAGAR ,Guntur, Andhra Pradesh 522001
                        <p />
                      </h6>
                    </div>
                  </div>
                  <div className="widget-contact-grid">
                    <div className="icon">
                      <i className="fas fa-phone-alt" />
                    </div>
                    <div className="contact-grid-details">
                      <p>Phone Number</p>
                      <h6>
                        <Link to="tel:888123456765">92480 22760</Link>
                        <p />
                      </h6>
                    </div>
                  </div>
                  <div className="widget-contact-grid">
                    <div className="icon">
                      <i className="fas fa-envelope" />
                    </div>
                    <div className="contact-grid-details">
                      <p>Email Address</p>
                      <h6>
                        <Link to="mailto:rajesh.katakam@gmail.com">
                        rajesh.katakam@gmail.com
                        </Link>
                        <p />
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright-wrap">
        <div className="container">
          <div className="row gy-3 justify-content-md-between justify-content-center">
            <div className="col-auto align-self-center">
              <p className="copyright-text text-center">
             Copyright ©  2025 <Link to="#" className="highlight-text">GOWRISANKAR AGENCIES</Link> | All Rights Reserved
              </p>
            </div>
            <div className="col-auto">
              <div className="footer-links">
                <p className="m-0"> Designed by <a href="https://dt7.agency/" target="_blank" rel="noopener noreferrer">
                  Dt7 Agency
                </a></p>
                
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterAreaFour;
