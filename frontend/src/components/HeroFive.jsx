import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs, EffectFade, Autoplay } from "swiper";
import { Link } from "react-router-dom";

const HeroFive = () => {
  return (
    <>
      <style>
        {`
          /* Hero Five Redesigned Styles */
          .hero-slide-overlay {
            position: relative;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            min-height: 600px;
            display: flex;
            align-items: center;
          }

          /* Dark overlay on background image */
          .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: hsl(210 15% 25% / 0.85);
            z-index: 1;
          }

          /* Ensure content appears above overlay */
          .hero-slide-overlay .container {
            position: relative;
            z-index: 2;
          }

          /* Hero content styling */
          .hero-slide-overlay .hero-style2 {
            padding: 60px 0;
          }

          .hero-slide-overlay .hero-title {
            font-size: 42px;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 20px;
            color: #ffffff;
          }

          .hero-slide-overlay .hero-text {
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #ffffff;
            opacity: 0.9;
          }

          /* Button styling */
          .hero-slide-overlay .btn-group {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
          }

          .hero-slide-overlay .btn {
            padding: 15px 35px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 5px;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
            background: #006aa3;
            color: #ffffff;
            border: 2px solid #0270acff;
          }

          .hero-slide-overlay .btn:hover {
            background: #ff5722;
            border-color: #ff5722;
            transform: translateY(-2px);
          }

          .hero-slide-overlay .btn.style-border {
            background: transparent;
            border: 2px solid #ffffff;
            color: #ffffff;
          }

          .hero-slide-overlay .btn.style-border:hover {
            background: #0270acff;
            color: #fff;
          }

          /* Navigation arrows styling */
          .hero-wrapper .swiper-button-next,
          .hero-wrapper .swiper-button-prev {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.2);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            backdrop-filter: blur(10px);
          }

          .hero-wrapper .swiper-button-next:hover,
          .hero-wrapper .swiper-button-prev:hover {
            background: rgba(255, 255, 255, 0.3);
          }

          .hero-wrapper .swiper-button-next::after,
          .hero-wrapper .swiper-button-prev::after {
            font-size: 20px;
          }

          /* Responsive design */
          @media (max-width: 991px) {
            .hero-slide-overlay .hero-title {
              font-size: 36px;
            }
            
            .hero-slide-overlay .hero-text {
              font-size: 16px;
            }
            
            .hero-slide-overlay .hero-style2 {
              padding: 40px 0;
            }
          }

          @media (max-width: 767px) {
           
            
            .hero-slide-overlay .hero-title {
              font-size: 28px;
            }
            
            .hero-slide-overlay .hero-text {
              font-size: 14px;
            }
            
            .hero-slide-overlay .btn {
              padding: 12px 25px;
              font-size: 14px;
            }
            
            .hero-slide-overlay .btn-group {
              
              gap: 10px;
            }
            
            .hero-slide-overlay .btn-group .btn {
              width: 100%;
              text-align: center;
            }
          }

          /* Add animation to content */
          .hero-slide-overlay .hero-style2 > * {
            animation: fadeInUp 0.8s ease forwards;
            opacity: 0;
          }

          .hero-slide-overlay .hero-title {
            animation-delay: 0.2s;
          }

          .hero-slide-overlay .hero-text {
            animation-delay: 0.4s;
          }

          .hero-slide-overlay .btn-group {
            animation-delay: 0.6s;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      
      <div className="hero-wrapper hero-5">
        <div className="hero-3-slider global-carousel">
          <Swiper
            modules={[FreeMode, Navigation, Thumbs, EffectFade, Autoplay]}
            effect="fade"
            fadeEffect={{ crossFade: true }} 
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
          >
            <SwiperSlide>
              <div
                className="hero-slide hero-slide-overlay"
                style={{
                  backgroundImage: "url(assets/img/bg/hero-slide-one.jpg)",
                }}
              >
                <div className="hero-overlay"></div>
                <div className="container">
                  <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-7">
                      <div className="hero-style2">
                        <h1 className="hero-title text-white">
                          Highly Modified Car Repair system
                        </h1>
                        <p className="hero-text text-white">
                          Premium parts engineered to enhance engine power, efficiency, and long-term performance.
                        </p>
                        <div className="btn-group">
                          <Link to="/about-us" className="btn-no-animation">
                            Learn About Us
                          </Link>
                          <Link to="/contact-us" className="btn-no-animation style-border bg-blur-btn">
                           Contact Us
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      {/* Empty right side */}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            
            <SwiperSlide>
              <div
                className="hero-slide hero-slide-overlay"
                style={{
                  backgroundImage: `url(${process.env.PUBLIC_URL}/assets/img/bg/hero-slide-two.jpg)`,
                }}
              >
                <div className="hero-overlay"></div>
                <div className="container">
                  <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-7">
                      <div className="hero-style2">
                        <h1 className="hero-title text-white">
                          Complete Engine Parts Collection
                        </h1>
                        <p className="hero-text text-white">
                          Specially designed components suitable for customized and performance-enhanced vehicles.
                        </p>
                        <div className="btn-group">
                          <Link to="/about-us" className="btn-no-animation">
                            Learn About Us
                          </Link>
                          <Link to="/contact-us" className="btn-no-animation style-border bg-blur-btn">
                           Contact Us
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      {/* Empty right side */}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
             <SwiperSlide>
              <div
                className="hero-slide hero-slide-overlay"
                style={{
                  backgroundImage: `url(${process.env.PUBLIC_URL}/assets/img/bg/hero-slide-three.jpg)`,
                }}
              >
                <div className="hero-overlay"></div>
                <div className="container">
                  <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-7">
                      <div className="hero-style2">
                        <h1 className="hero-title text-white">
                          Complete Engine Parts Collection
                        </h1>
                        <p className="hero-text text-white">
                          Extensive range of reliable engine components for multiple car models and configurations.
                        </p>
                        <div className="btn-group">
                          <Link to="/about-us" className="btn-no-animation">
                            Learn About Us
                          </Link>
                          <Link to="/contact-us" className="btn-no-animation style-border bg-blur-btn">
                           Contact Us
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      {/* Empty right side */}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default HeroFive;