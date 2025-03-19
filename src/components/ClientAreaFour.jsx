import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Pagination, Thumbs, EffectFade, Autoplay } from "swiper";
import { Link } from "react-router-dom";
const ClientAreaFour = () => {
  return (
    <div className="client-area-3">
      <div className="container">
        <div className="row gx-80">
          {/* <div className="col-lg-5"> 
            <div className="client3-wrap">
              <div className="title-area mb-0">
                <span className="sub-title">Logo Brands &amp; Clients</span>
                <h2 className="sec-title">
                Brands we Trust
                </h2>
                <p className="sec-text">
                  A car repair is a service provided to fix any issues or
                  damages with a your vehicle. It involves diagnosing the
                  problem, repairing or replacing the necessary parts, and
                  ensuring that the car
                </p>
              </div>
            </div>
          </div> */}

          <div className="col-lg-12">
            <div className="client-slider3">
              <div className="title-area">
                <h2 className="sec-title text-dark text-center  gsa-title">Brands we Trust</h2>
              </div>
              <Swiper
                navigation={{
                  nextEl: ".team-slider2-next",
                  prevEl: ".team-slider2-prev",
                }}
                spaceBetween={20}
                slidesPerGroup={1}
                speed={1000}
                pagination={{ clickable: true }}
                loop
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                className="mySwiper"
                modules={[FreeMode, Navigation, Thumbs, EffectFade, Autoplay]}
                breakpoints={{
                  0: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                  992: {
                    slidesPerView: 4,
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
                    <div className="category-card-item">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/img/update-img/client/1-1.png`}
                        alt="Fixturbo"
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="category-card-item">
                      <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/client/1-2.png`}
                        alt="Fixturbo"
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="category-card-item">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/img/update-img/client/1-3.png`}
                        alt="Fixturbo"
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="category-card-item">
                      <img
                       src={`${process.env.PUBLIC_URL}/assets/img/update-img/client/1-4.png`}
                        alt="Fixturbo"
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="category-card-item">
                      <img
                     src={`${process.env.PUBLIC_URL}/assets/img/update-img/client/1-5.png`}
                        alt="Fixturbo"
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="category-card-item">
                      <img
                       src={`${process.env.PUBLIC_URL}/assets/img/update-img/client/1-6.png`}
                        alt="Fixturbo"
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="category-card-item">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/img/update-img/client/1-7.png`}
                        alt="Fixturbo"
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="category-card-item">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/img/update-img/client/client-02.png`}
                        alt="Fixturbo"
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="category-card-item">
                      <img
                       src={`${process.env.PUBLIC_URL}/assets/img/update-img/client/client-03.png`}
                        alt="Fixturbo"
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="category-card-item">
                      <img
                       src={`${process.env.PUBLIC_URL}/assets/img/update-img/client/client-05.png`}
                        alt="Fixturbo"
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="category-card-item">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/img/update-img/client/client-06.png`}
                        alt="Fixturbo"
                      />
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

export default ClientAreaFour;
