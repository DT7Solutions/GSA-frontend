import React from "react";

const ContactArea = () => {
  return (
    <>
      <div className="contact-area space">
        <div className="container">
          <div className="row gy-4 justify-content-center">
            <div className="col-xxl-4 col-lg-4 col-md-6">
              <div className="contact-info">
                <div className="contact-info_icon">
                  <i className="fas fa-map-marker-alt" />
                </div>
                <h6 className="contact-info_title">Address</h6>
                <p className="contact-info_text">
                  Plot No: 381, Phase 1 & 2, Indira Autonagar,
                </p>
                <p className="contact-info_text">
                  Guntur, Andhra Pradesh, India
                </p>
              </div>
            </div>

            <div className="col-xxl-4 col-lg-4 col-md-6">
              <div className="contact-info">
                <div className="contact-info_icon">
                  <i className="fas fa-phone-alt" />
                </div>
                <h6 className="contact-info_title">Phone Number</h6>
                <p className="contact-info_text">
                  <a href="tel:09248022760">092480 22760</a>
                </p>
              </div>
            </div>

            {/* <div className="col-xxl-3 col-lg-4 col-md-6">
              <div className="contact-info">
                <div className="contact-info_icon">
                  <i className="fas fa-clock" />
                </div>
                <h6 className="contact-info_title">Opening Hours</h6>
                <p className="contact-info_text">Mon–Sat: 9AM to 7PM</p>
                <p className="contact-info_text">Sunday: Closed</p>
              </div>
            </div> */}

            <div className="col-xxl-4 col-lg-4 col-md-6">
              <div className="contact-info">
                <div className="contact-info_icon">
                  <i className="fas fa-envelope" />
                </div>
                <h6 className="contact-info_title">E-mail</h6>
                <p className="contact-info_text">
                  <a href="mailto:rajesh.katakam@gmail.com">
                    rajesh.katakam@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-bottom">
        <div className="container">
          <div className="row">
            {/* Contact Form - Left Side */}
            <div className="col-lg-6">
              <div className="contact-form-wrap p-0">
                <div className="title-area">
                  <span className="sub-title">Contact form</span>
                  <h2 className="sec-title">
                    Your Trusted Car Service Partner
                  </h2>
                </div>
                <form
                  action="mail.php"
                  method="POST"
                  className="appointment-form ajax-contact input-style"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          id="name"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          id="email"
                          placeholder="Email Address"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          name="number"
                          id="number"
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <select
                          className="form-control"
                          name="enquiry"
                          id="enquiry"
                          defaultValue=""
                        >
                          <option value="">Select Enquiry Type</option>
                          <option value="spare-parts">Spare Parts</option>
                          <option value="car-service">Car Service</option>
                          <option value="repair">Repair</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-12">
                    <textarea
                      placeholder="Message here.."
                      id="contactForm"
                      className="form-control"
                      defaultValue={""}
                    />
                  </div>
                  <div className="form-btn col-12">
                    <button className="btn style2">
                      Appointment Now <i className="fas fa-arrow-right ms-2" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Map - Right Side */}
            <div className="col-lg-6">
              <div
                className="map-sec"
                style={{ height: "100%", minHeight: "500px" }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3828.9744778971535!2d80.47491364630527!3d16.324248280711437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f560af1250ff%3A0x34dee9a6503aa770!2sGOWRISANKAR%20AGENCIES!5e0!3m2!1sen!2sin!4v1749801151654!5m2!1sen!2sin"
                  allowFullScreen=""
                  loading="lazy"
                  title="address"
                  style={{ width: "100%", height: "100%", border: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactArea;
