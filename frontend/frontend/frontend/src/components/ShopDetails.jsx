import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
const ShopDetails = () => {
  return (
    <section className="product-details space-top">
      <div className="container">
        <div className="row gx-80">
          <div className="col-lg-6">
            <div className="product-thumb">
              <div className="img">
                <img
                  src="assets/img/update-img/product/product-inner.png"
                  alt="Fixturbo"
                />
              </div>
              <div className="product-tag">Sale</div>
            </div>
          </div>
          <div className="col-lg-6 align-self-center">
            <div className="product-about">
              <p className="price">
                $25 <del>$30</del>
              </p>
              <h2 className="product-title">Engine pistons and cog</h2>
              <div className="product-rating">
                <span className="star-rating">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star unavailable" />
                </span>
                (5 Reviews)
              </div>
              <p className="text">
                A car shop is a place where you can find a wide range of
                services and products related to automobiles. From vehicle
                repairs and maintenance to car accessories and parts, a car shop
                offers everything you need to keA car
              </p>
              <button className="btn style2">Buy It Now</button>
              <div className="product_meta">
                <span className="sku_wrapper">
                  SKU: <span className="sku">Wheel-fits-chevy-camaro</span>
                </span>
                <span className="posted_in">
                  Category:{" "}
                  <Link to="/shop" rel="tag">
                    Tires &amp; Wheels
                  </Link>
                </span>
                <span>
                  Tags: <Link to="/shop">Automotive parts</Link>
                  <Link to="/shop">Wheels</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="product-tab-area">
          <ul className="nav product-tab-style1" id="productTab" role="tablist">
            <li className="nav-item" role="presentation">
              <a
                className="nav-link active"
                id="description-tab"
                data-bs-toggle="tab"
                href="#description"
                role="tab"
                aria-controls="description"
                aria-selected="false"
              >
                Description
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link"
                id="info-tab"
                data-bs-toggle="tab"
                href="#add_info"
                role="tab"
                aria-controls="add_info"
                aria-selected="false"
              >
                Additional Information
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link"
                id="reviews-tab"
                data-bs-toggle="tab"
                href="#reviews"
                role="tab"
                aria-controls="reviews"
                aria-selected="true"
              >
                Reviews (03)
              </a>
            </li>
          </ul>
          <div className="tab-content" id="productTabContent">
            <div
              className="tab-pane fade show active"
              id="description"
              role="tabpanel"
              aria-labelledby="description-tab"
            >
              <p>
                Credibly negotiate emerging materials whereas clicks-and-mortar
                intellectual capital. Compellingly whiteboard client-centric
                sources before cross-platform schemas. Distinctively develop
                future-proof outsourcing without multimedia based portals.
                Progressively coordinate next-generation architectures for
                collaborative solutions. Professionally restore
                backward-compatible quality vectors before customer directed
                metrics. Holisticly restore technically sound internal or
                "organic" sources before client-centered human capital
                underwhelm holistic mindshare for prospective innovation.
              </p>
              <p className="mb-n1">
                Seamlessly target fully tested infrastructures whereas just in
                time process improvements. Dynamically exploit team driven
                functionalities vis a vis global total linkage redibly
                synthesize just in time technology rather than open-source
                strategic theme areas.
              </p>
            </div>
            <div
              className="tab-pane fade"
              id="add_info"
              role="tabpanel"
              aria-labelledby="add_info"
            >
              <table className="woocommerce-table">
                <tbody>
                  <tr>
                    <th>Brand</th>
                    <td>Jakuna</td>
                  </tr>
                  <tr>
                    <th>Color</th>
                    <td>Yellow</td>
                  </tr>
                  <tr>
                    <th>Weight</th>
                    <td>400 gm</td>
                  </tr>
                  <tr>
                    <th>Battery</th>
                    <td>Lithium</td>
                  </tr>
                  <tr>
                    <th>Material</th>
                    <td>Wood</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              className="tab-pane fade"
              id="reviews"
              role="tabpanel"
              aria-labelledby="reviews-tab"
            >
              <div className="comments-wrap mt-0">
                <ul className="comment-list">
                  <li className="comment-item">
                    <div className="post-comment">
                      <div className="comment-avater">
                        <img
                          src="assets/img/team/team-1-1.png"
                          alt="Comment Author"
                        />
                      </div>
                      <div className="comment-content">
                        <span className="commented-on">
                          <i className="fas fa-calendar-alt" />
                          15 JUN, 2023
                        </span>
                        <h3 className="name">Daniel Adam</h3>
                        <p className="text">
                          Collaboratively empower multifunctional e-commerce for
                          prospective applications. Seamlessly productivate
                          plug-and-play markets whereas synergistic scenarios.
                          Ecommerce for prospective applications. Seamlessly
                          productivate plug-and-play markets whereas synergistic
                          scenarios
                        </p>
                        <div className="reply_and_edit">
                          <Link to="/blog-details" className="reply-btn">
                            Reply <i className="fas fa-reply" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <ul className="children">
                      <li className="comment-item">
                        <div className="post-comment">
                          <div className="comment-avater">
                            <img
                              src="assets/img/team/team-1-2.png"
                              alt="Comment Author"
                            />
                          </div>
                          <div className="comment-content">
                            <span className="commented-on">
                              <i className="fas fa-calendar-alt" />
                              15 JUN, 2023
                            </span>
                            <h3 className="name">Zenelia Lozhe</h3>
                            <p className="text">
                              Collaboratively empower multifunctional e-commerce
                              for prospective application mlessly productivate
                            </p>
                            <div className="reply_and_edit">
                              <Link to="/blog-details" className="reply-btn">
                                Reply <i className="fas fa-reply" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li className="comment-item">
                    <div className="post-comment">
                      <div className="comment-avater">
                        <img
                          src="assets/img/team/team-1-3.png"
                          alt="Comment Author"
                        />
                      </div>
                      <div className="comment-content">
                        <span className="commented-on">
                          <i className="fas fa-calendar-alt" />
                          15 JUN, 2023
                        </span>
                        <h3 className="name">John Smith</h3>
                        <p className="text">
                          Collaboratively empower multifunctional e-commerce for
                          prospective applications. Seamlessly productivate
                          plug-and-play markets whereas synergistic scenarios.
                        </p>
                        <div className="reply_and_edit">
                          <Link to="/blog-details" className="reply-btn">
                            Reply <i className="fas fa-reply" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>{" "}
              {/* Comment end */}
              {/* Comment Form */}
              <div className="comment-form bg-smoke2">
                <div className="form-title">
                  <h3 className="blog-inner-title"> Leave a Reply</h3>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="form-control style-white"
                    />
                    <i className="far fa-user" />
                  </div>
                  <div className="col-md-6 form-group">
                    <input
                      type="text"
                      placeholder="Email Address"
                      className="form-control style-white"
                    />
                    <i className="far fa-envelope" />
                  </div>
                  <div className="col-12 form-group">
                    <textarea
                      placeholder="Type Your Message"
                      className="form-control style-white"
                      defaultValue={""}
                    />
                    <i className="far fa-pencil" />
                  </div>
                  <div className="col-12 form-group mb-0">
                    <button className="btn style2">Get a Quote</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*==============================
        Related Product  
        ==============================*/}
        <div className="space-extra-top space-bottom">
          <div className="row justify-content-between">
            <div className="col-md-6">
              <div className="title-area">
                <h2 className="sec-title">Related Products.</h2>
              </div>
            </div>
            <div className="col-md-auto">
              <div className="sec-btn mb-40">
                <Link to="/shop" className="btn style-border2">
                  See More
                </Link>
              </div>
            </div>
          </div>
          <div className="row global-carousel" id="productCarousel">
            <Swiper
              loop={true}
              spaceBetween={20}
              slidesPerGroup={1}
              speed={1000}
              pagination={{ clickable: true }}
              autoplay={{ delay: 6000 }}
              className="mySwiper"
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
                1400: {
                  slidesPerView: 4,
                },
              }}
            >
              <SwiperSlide>
                <div>
                  <div className="product-card style2">
                    <div className="product-img">
                      <img
                        src="assets/img/update-img/product/1-1.png"
                        alt="Fixturbo"
                      />
                    </div>
                    <div className="product-content">
                      <h3 className="product-title">
                        <Link to="/shop-details">Engine pistons and cog</Link>
                      </h3>
                      <span className="star-rating">
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                      </span>
                      <span className="price">
                        <del>$30</del> $25
                      </span>
                      <Link to="#" className="link-btn">
                        Add to cart <i className="fas fa-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <div className="product-card style2">
                    <div className="product-img">
                      <img
                        src="assets/img/update-img/product/1-2.png"
                        alt="Fixturbo"
                      />
                    </div>
                    <div className="product-content">
                      <h3 className="product-title">
                        <Link to="/shop-details">Exhaust manifold</Link>
                      </h3>
                      <span className="star-rating">
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                      </span>
                      <span className="price">
                        <del>$30</del> $25
                      </span>
                      <Link to="#" className="link-btn">
                        Add to cart <i className="fas fa-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <div className="product-card style2">
                    <div className="product-img">
                      <img
                        src="assets/img/update-img/product/1-3.png"
                        alt="Fixturbo"
                      />
                    </div>
                    <div className="product-content">
                      <h3 className="product-title">
                        <Link to="/shop-details">Windshield wiper motor</Link>
                      </h3>
                      <span className="star-rating">
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                      </span>
                      <span className="price">
                        <del>$30</del> $25
                      </span>
                      <Link to="#" className="link-btn">
                        Add to cart <i className="fas fa-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <div className="product-card style2">
                    <div className="product-img">
                      <img
                        src="assets/img/update-img/product/1-4.png"
                        alt="Fixturbo"
                      />
                    </div>
                    <div className="product-content">
                      <h3 className="product-title">
                        <Link to="/shop-details">Power steering pump</Link>
                      </h3>
                      <span className="star-rating">
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                      </span>
                      <span className="price">
                        <del>$30</del> $25
                      </span>
                      <Link to="#" className="link-btn">
                        Add to cart <i className="fas fa-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <div className="product-card style2">
                    <div className="product-img">
                      <img
                        src="assets/img/update-img/product/1-5.png"
                        alt="Fixturbo"
                      />
                    </div>
                    <div className="product-content">
                      <h3 className="product-title">
                        <Link to="/shop-details">Windshield wiper motor</Link>
                      </h3>
                      <span className="star-rating">
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                      </span>
                      <span className="price">
                        <del>$30</del> $25
                      </span>
                      <Link to="#" className="link-btn">
                        Add to cart <i className="fas fa-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopDetails;
