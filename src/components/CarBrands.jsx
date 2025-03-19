import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs, EffectFade, Autoplay } from "swiper";
import { Link } from "react-router-dom";
const CarBrands = () => {
  return (
    <div className="service-area-2 space-bottom position-relative z-index-common">
      <div className="container">
        <div className="row gy-4 justify-content-center">
       
          <div className="col-lg-12">
            <div className="row global-carousel service-client-slider">
              <Swiper
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                spaceBetween={20}
                slidesPerGroup={1}
                speed={1000}
                pagination={{ clickable: true }}
                className="mySwiper"
                modules={[FreeMode, Navigation, Thumbs, EffectFade, Autoplay]}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  992: {
                    slidesPerView: 5,
                  },
                  1200: {
                    slidesPerView: 5,
                  },
                  1400: {
                    slidesPerView: 5,
                  },
                }}
              >
                <SwiperSlide>
                  <div>
                    <div className="client-logo">
                      <Link to="#">
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="client-logo">
                      <Link to="#">
                        <img src={`${process.env.PUBLIC_URL}/assets/img/client/2.png`} alt="Fixturbo" />
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="client-logo">
                      <Link to="#">
                        <img src={`${process.env.PUBLIC_URL}/assets/img/client/3.png`} alt="Fixturbo" />
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="client-logo">
                      <Link to="#">
                        <img src={`${process.env.PUBLIC_URL}/assets/img/client/4.png`} alt="Fixturbo" />
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="client-logo">
                      <Link to="#">
                        <img src="assets/img/client/5.png" alt="Fixturbo" />
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="client-logo">
                      <Link to="#">
                        <img src="assets/img/client/3.png" alt="Fixturbo" />
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarBrands;
