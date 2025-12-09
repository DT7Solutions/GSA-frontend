import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Pagination, Thumbs, EffectFade, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ClientAreaFour = () => {
  // Group logos into pairs for vertical display
  const logoPairs = [
    [
      `${process.env.PUBLIC_URL}/assets/img/update-img/client/1-1.png`,
      `${process.env.PUBLIC_URL}/assets/img/update-img/client/1-2.png`
    ],
    [
      `${process.env.PUBLIC_URL}/assets/img/update-img/client/1-3.png`,
      `${process.env.PUBLIC_URL}/assets/img/update-img/client/1-4.png`
    ],
    [
      `${process.env.PUBLIC_URL}/assets/img/update-img/client/1-5.png`,
      `${process.env.PUBLIC_URL}/assets/img/update-img/client/1-6.png`
    ],
    [
      `${process.env.PUBLIC_URL}/assets/img/update-img/client/1-7.png`,
      `${process.env.PUBLIC_URL}/assets/img/update-img/client/BMW.png`
    ],
    [
      `${process.env.PUBLIC_URL}/assets/img/update-img/client/Jaguar.png`,
      `${process.env.PUBLIC_URL}/assets/img/update-img/client/Ford.png`
    ],
    [
      `${process.env.PUBLIC_URL}/assets/img/update-img/client/toyota.png`,
      `${process.env.PUBLIC_URL}/assets/img/update-img/client/1-1.png`
    ]
  ];

  return (
    <div className="client-area-3" style={{  background: "#fff" }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="client-slider3">
              <div className="title-area" style={{ marginBottom: "40px" }}>
                <h4 className="sec-title text-dark text-center" style={{ fontSize: "32px", fontWeight: "600" }}>
                  Brands we Trust
                </h4>
              </div>
              
              <Swiper
                navigation={{
                  nextEl: ".team-slider2-next",
                  prevEl: ".team-slider2-prev",
                }}
                spaceBetween={0}
                slidesPerGroup={1}
                speed={1000}
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                modules={[FreeMode, Navigation, Thumbs, EffectFade, Autoplay]}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  992: {
                    slidesPerView: 3,
                  },
                  1200: {
                    slidesPerView: 4,
                  },
                }}
              >
                {logoPairs.map((pair, index) => (
                  <SwiperSlide key={index}>
                    <div className="vertical-logo-container" style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      
                      borderRight: "2px solid #ddd"
                    }}>
                      {/* Top Logo */}
                      <div className="logo-item" style={{
                        background: "#fff",
                       
                       
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        minHeight:"100px",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease"
                      }}>
                        <img
                          src={pair[0]}
                          alt="Brand Logo"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain"
                          }}
                        />
                      </div>

                      {/* Middle Border Line */}
                      <div className="border-line" style={{
                        position: "relative",
                        width: "100%",
                        height: "2px",
                        background: "#ddd",
                       
                      }}>
                       
                       
                      </div>

                      {/* Bottom Logo */}
                      <div className="logo-item" style={{
                        background: "#fff",
                       
                       
                      
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        minHeight:"100px",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease"
                      }}>
                        <img
                          src={pair[1]}
                          alt="Brand Logo"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain"
                          }}
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>

      <style>{`
       

        .swiper-button-next,
        .swiper-button-prev {
          color: #333;
          background: #fff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 18px;
        }

        .swiper-pagination-bullet {
          background: #333;
        }

        .swiper-pagination {
          margin-top: 30px;
        }

        @media (max-width: 767px) {
          .logo-item {
            height: 100px !important;
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ClientAreaFour;