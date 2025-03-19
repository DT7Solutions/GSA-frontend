import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs, EffectFade } from "swiper";
const TestimonialOne = () => {
  return (
    <div
      className="testimonial-area-11 overflow-hidden mt-5"
      style={{ backgroundImage: "url(assets/img/bg/testimonial-bg1-1.png)" }}
    >
      <div className="container">
        <div className="row">
          {/* <div className="col-lg-6">
            <div className="testimonial-thumb1">
              <img src={`${process.env.PUBLIC_URL}/assets/img/testimonial/testimonial-1-1.png`} alt="Fixturbo" />
            </div>
          </div> */}
          <div className="col-lg-12">
            <div className="space1">
              <div className="title-area">
                {/* <span className="sub-title">Clients  Feedback</span> */}

                <h2 className="sec-title text-dark text-center mt-5 gsa-title">
                Clients  Says
                </h2>
              </div>
              <div className="row global-carousel testi-slider-1 mb-5">
                <Swiper
                  loop={true}
                  navigation={{
                    nextEl: ".testimonialOne-button-next",
                    prevEl: ".testimonialOne-button-prev",
                  }}
                  spaceBetween={20}
                  slidesPerGroup={1}
                  speed={1000}
                  autoplay={{ delay: 6000 }}
                  pagination={true}
                  className="mySwiper"
                  modules={[FreeMode, Navigation, Thumbs, EffectFade]}
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                    },
                    500: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 1,
                    },
                    992: {
                      slidesPerView: 1,
                    },
                    1200: {
                      slidesPerView: 1,
                    },
                    1400: {
                      slidesPerView: 1,
                    },
                  }}
                >
                  <SwiperSlide>
                    <div>
                      <div className="testi-card">
                        <div className="testi-card_content">
                          <div className="testi-card-profile">
                            <div className="testi-card-profile-details">
                              <h4 className="testi-profile-title">
                                Nafiz Bhuiyan
                              </h4>
                              <span className="testi-profile-desig">
                                Customer
                              </span>
                            </div>
                            <div className="quote-icon">
                              <img
                                src={`${process.env.PUBLIC_URL}/assets/img/icon/quote1-1.svg`}
                                alt="Fixturbo"
                              />
                            </div>
                          </div>
                          <p className="testi-card_text">
                            Roof services include repairs installations, and
                            maintena resident commercial buildings. Expert the a
                            technicians diagnose and ther address issues roofing
                            mater gutter systems, and ventilation a Roof
                            services
                          </p>
                          <div className="rating">
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div>
                      <div className="testi-card">
                        <div className="testi-card_content">
                          <div className="testi-card-profile">
                            <div className="testi-card-profile-details">
                              <h4 className="testi-profile-title">
                                Nafiz Bhuiyan
                              </h4>
                              <span className="testi-profile-desig">
                                Customer
                              </span>
                            </div>
                            <div className="quote-icon">
                              <img
                                src={`${process.env.PUBLIC_URL}/assets/img/icon/quote1-1.svg`}
                                alt="Fixturbo"
                              />
                            </div>
                          </div>
                          <p className="testi-card_text">
                            Roof services include repairs installations, and
                            maintena resident commercial buildings. Expert the a
                            technicians diagnose and ther address issues roofing
                            mater gutter systems, and ventilation a Roof
                            services
                          </p>
                          <div className="rating">
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div>
                      <div className="testi-card">
                        <div className="testi-card_content">
                          <div className="testi-card-profile">
                            <div className="testi-card-profile-details">
                              <h4 className="testi-profile-title">
                                Nafiz Bhuiyan
                              </h4>
                              <span className="testi-profile-desig">
                                Customer
                              </span>
                            </div>
                            <div className="quote-icon">
                              <img
                                src={`${process.env.PUBLIC_URL}/assets/img/icon/quote1-1.svg`}
                                alt="Fixturbo"
                              />
                            </div>
                          </div>
                          <p className="testi-card_text">
                            Roof services include repairs installations, and
                            maintena resident commercial buildings. Expert the a
                            technicians diagnose and ther address issues roofing
                            mater gutter systems, and ventilation a Roof
                            services
                          </p>
                          <div className="rating">
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>

                <div className="testimonialOne arrow">
                  <div className=" testimonialOne-button-next testimonialOne-button">
                    <i className="fas fa-arrow-left"></i>
                  </div>
                  <div className=" testimonialOne-button-prev testimonialOne-button">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialOne;
