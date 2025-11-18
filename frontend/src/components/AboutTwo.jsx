import React from "react";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
const AboutTwo = () => {
  return (
    <div className="space-top">
      <div className="container">
        <div className="row">
          {/* ABOUT US SECTION - Image LEFT, Content RIGHT */}
          <div className="col-xxl-7 col-xl-6">
            <div className="about-thumb2 mb-40 mb-xl-0">
              <div className="faq-thumb2 mb-xl-0 mb-50">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/img/portfolio/about-img.png`}
                  alt="About Us"
                />
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
                  Gowrisankar Agencies is an authorized dealer for Hyundai and
                  Toyota auto body parts in Guntur. We specialize in supplying
                  high-quality, genuine components for both brands, ensuring
                  perfect fit and performance. From bumpers and lights to
                  mirrors and doors, we stock a wide range of parts for various
                  models. With a commitment to quality, competitive pricing, and
                  expert customer service, we have become a trusted name among
                  car owners and workshops. Whether you need a replacement part
                  or a full body solution, Gowrisankar Agencies is your go-to
                  destination for reliable Hyundai and Toyota body parts in
                  Guntur.
                </p>
              </div>
            </div>
          </div>

          {/* ABOUT FOUNDER SECTION - Content LEFT, Image RIGHT */}
          <div className="col-xxl-5 col-xl-6 order-xl-1 order-2 mt-5 mt-xl-0">
            <div className="about-content-wrap">
              <div className="title-area mb-30">
                <span className="sub-title">Our Leadership</span>
                <h2 className="sec-title">
                  Meet Our Founder{" "}
                  <img
                    className="title-bg-shape shape-center"
                    src="assets/img/bg/title-bg-shape.png"
                    alt="GSA"
                  />
                </h2>
                <p className="sec-text">
                  [Founder Name] established Gowrisankar Agencies with a vision
                  to provide authentic and reliable auto body parts to the
                  people of Guntur. With [X] years of experience in the
                  automotive industry, our founder recognized the need for a
                  trustworthy source of genuine Hyundai and Toyota parts. Under
                  their leadership, Gowrisankar Agencies has grown into a
                  respected name, known for integrity, quality service, and
                  customer satisfaction.
                </p>
              </div>
            </div>
          </div>
          <div className="col-xxl-7 col-xl-6 order-xl-2 order-1">
            <div className="about-thumb2 mb-40 mb-xl-0">
              <div className="faq-thumb2 faq-thumb2-right mb-xl-0 mb-50">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/img/normal/faq-thumb-2-1.png`}
                  alt="Founder"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTwo;
