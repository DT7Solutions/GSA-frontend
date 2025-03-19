import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs, EffectFade, Autoplay } from "swiper";
import { Link } from "react-router-dom";
const CategoryAreaOne = () => {
  return (
    // pt-95
    <div className="category-area-1 pb-100">
      <div className="container">
        <h4 className="text-center fw-extrabold mb-20">Search By Categories</h4>
        <div className="row gx-0 global-carousel category-slider3">
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
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-1.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-2.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-3.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-4.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-5.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-6.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-7.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-8.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-1.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-2.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-3.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-4.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-5.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-6.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-7.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="category-card-item">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/img/update-img/category/category1-8.png`}
                    alt="Fixturbo"
                  />
                  <h6 className="category-card-title">
                    <Link to="/shop-details">Engine pistons</Link>
                  </h6>
                  <p className="category-card-text">12 Products</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default CategoryAreaOne;
