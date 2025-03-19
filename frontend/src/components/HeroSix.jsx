import React from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs, EffectFade, Autoplay } from "swiper";

const HeroSix = () => {
  return (
    <div className="hero-wrapper" id="hero">
      <div className="container">
        <Swiper
         effect="fade" 
         fadeEffect={{ crossFade: true }} 
          navigation={{
            nextEl: ".team-slider2-next",
            prevEl: ".team-slider2-prev",
          }}
          spaceBetween={20}
          slidesPerGroup={1}
          speed={1000}
          pagination={{ clickable: true }}
          loop
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          className="mySwiper"
          modules={[FreeMode, Navigation, Thumbs, EffectFade, Autoplay]}
          breakpoints={{
            0: {
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
            <div className="hero-6" style={{ backgroundColor: "#EAE1D6" }}>
              <div className="row flex-row-reverse align-items-center">
                <div className="col-md-6">
                  <div className="hero-thumb text-center">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/img/update-img/hero6-1.png`}
                      alt="Fixturbo"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="hero-style6">
                    <span className="sub-title">Featured Product</span>
                    <h1 className="hero-title">Engine pistons</h1>
                    <div className="btn-group">
                      <Link to="/shop" className="btn style2 style-radius">
                        Shop Now
                      </Link>
                      <span className="offer-tag">Up to 20% Off</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="hero-6" style={{ backgroundColor: "#EAE1D6" }}>
              <div className="row flex-row-reverse align-items-center">
                <div className="col-md-6">
                  <div className="hero-thumb text-center">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/img/update-img/hero-bg.png`}
                      alt="Fixturbo"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="hero-style6">
                    <span className="sub-title">Featured Product</span>
                    <h1 className="hero-title">Engine pistons</h1>
                    <div className="btn-group">
                      <Link to="/shop" className="btn style2 style-radius">
                        Shop Now
                      </Link>
                      <span className="offer-tag">Up to 20% Off</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

        </Swiper>

        {/* <div className="hero-6" style={{ backgroundColor: "#EAE1D6" }}>
          <div className="row flex-row-reverse align-items-center">
            <div className="col-md-6">
              <div className="hero-thumb text-center">
                <img src={`${process.env.PUBLIC_URL}/assets/img/update-img/hero6-1.png`} alt="Fixturbo" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="hero-style6">
                <span className="sub-title">Featured Product</span>
                <h1 className="hero-title">Engine pistons</h1>
                <div className="btn-group">
                  <Link to="/shop" className="btn style2 style-radius">
                    Shop Now
                  </Link>
                  <span className="offer-tag">Up to 20% Off</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/*==============================
        Intro Area  
        ==============================*/}
        <div className="row gx-30 gy-30 mt-5">
          <div className="col-lg-4 col-md-6">
            <div
              className="hero-intro-card"
              style={{ backgroundColor: "#F2F2EF" }}
            >
              <div className="intro-card-img">
                <img src={`${process.env.PUBLIC_URL}/assets/img/update-img/hero6-2.png`} alt="Fixturbo" />
              </div>
              <div className="intro-card-details">
                <h6 className="intro-card-subtitle">save up to $5.00</h6>
                <h4 className="intro-card-title">
                  <Link to="#">Engine pistons and cog</Link>
                </h4>
                <Link to="/shop" className="btn style5 style-radius">
                  Shop Now
                  <i className="fas fa-arrow-right ms-2" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div
              className="hero-intro-card"
              style={{ backgroundColor: "rgba(221, 76, 100, 0.3)" }}
            >
              <div className="intro-card-img">
                <img src={`${process.env.PUBLIC_URL}/assets/img/update-img/hero6-3.png`} alt="Fixturbo" />
              </div>
              <div className="intro-card-details">
                <h6 className="intro-card-subtitle">save up to $5.00</h6>
                <h4 className="intro-card-title">
                  <Link to="#">Engine pistons and cog</Link>
                </h4>
                <Link to="/shop" className="btn style5 style-radius">
                  Shop Now
                  <i className="fas fa-arrow-right ms-2" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="hero-intro-card bg-theme">
              <div className="intro-card-img">
                <img src={`${process.env.PUBLIC_URL}/assets/img/update-img/hero6-4.png`} alt="Fixturbo" />
              </div>
              <div className="intro-card-details">
                <h6 className="intro-card-subtitle text-white">
                  save up to $5.00
                </h6>
                <h4 className="intro-card-title text-white">
                  <Link to="#">Engine pistons and cog</Link>
                </h4>
                <Link to="/shop" className="btn style5 style-radius">
                  Shop Now
                  <i className="fas fa-arrow-right ms-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSix;
