import React, { useState } from "react";
import Slider from "rc-slider";
import { Link } from "react-router-dom";

const ShopArea = () => {
  const [range, setRange] = useState([0, 100]);

  const handleRangeChange = (value) => {
    setRange(value);
  };
  return (
    <section className="space-top space-extra-bottom">
      <div className="container">
        <div className="row flex-row-reverse">
          <div className="col-xl-9 col-lg-8">
            <div className="shop-sort-bar">
              <div className="row justify-content-between align-items-center">
                <div className="col-md">
                  <p className="woocommerce-result-count">
                    Showing 1–15 of 52 results
                  </p>
                </div>
                <div className="col-md-auto">
                  <form className="woocommerce-ordering" method="get">
                    <div className="form-group mb-0">
                      <select
                        name="orderby"
                        className="single-select orderby"
                        aria-label="Shop order"
                        defaultValue={"Choose"}
                      >
                        <option value="Choose">Default Sorting</option>
                        <option value="popularity">Sort by popularity</option>
                        <option value="rating">Sort by average rating</option>
                        <option value="date">Sort by latest</option>
                        <option value="price">
                          Sort by price: low to high
                        </option>
                        <option value="price-desc">
                          Sort by price: high to low
                        </option>
                      </select>
                      <i className="fas fa-angle-down" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="row gy-4">
              <div className="col-xl-4 col-md-6">
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
              <div className="col-xl-4 col-md-6">
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
              <div className="col-xl-4 col-md-6">
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
              <div className="col-xl-4 col-md-6">
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
              <div className="col-xl-4 col-md-6">
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
              <div className="col-xl-4 col-md-6">
                <div className="product-card style2">
                  <div className="product-img">
                    <img
                      src="assets/img/update-img/product/1-6.png"
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
              <div className="col-xl-4 col-md-6">
                <div className="product-card style2">
                  <div className="product-img">
                    <img
                      src="assets/img/update-img/product/1-7.png"
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
              <div className="col-xl-4 col-md-6">
                <div className="product-card style2">
                  <div className="product-img">
                    <img
                      src="assets/img/update-img/product/1-8.png"
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
              <div className="col-xl-4 col-md-6">
                <div className="product-card style2">
                  <div className="product-img">
                    <img
                      src="assets/img/update-img/product/1-9.png"
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
            </div>
            <div className="pagination justify-content-center mt-70">
              <ul>
                <li>
                  <Link to="/blog">1</Link>
                </li>
                <li>
                  <Link to="/blog">2</Link>
                </li>
                <li>
                  <Link to="/blog">3</Link>
                </li>
                <li>
                  <Link to="/blog">
                    <i className="fas fa-angle-right" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 sidebar-widget-area">
            <aside className="sidebar-sticky-area sidebar-area sidebar-shop">
              <div className="widget widget_search">
                <h3 className="widget_title">Search</h3>
                <form className="search-form">
                  <input type="text" placeholder="Find your product" />
                  <button type="submit">
                    <i className="fas fa-search" />
                  </button>
                </form>
              </div>
              <div className="widget widget_categories  ">
                <h3 className="widget_title">Product categories</h3>
                <ul>
                  <li>
                    <Link to="/service-details">Steering wheel</Link>
                    <span>(12)</span>
                  </li>
                  <li>
                    <Link to="/service-details">Suspension spring</Link>{" "}
                    <span>(12)</span>
                  </li>
                  <li>
                    <Link to="/service-details">Tail light</Link>
                    <span>(08)</span>
                  </li>
                  <li>
                    <Link to="/service-details">Transmission</Link>
                    <span>(13)</span>
                  </li>
                  <li>
                    <Link to="/service-details">Windshield wiper motor</Link>
                    <span>(03)</span>
                  </li>
                  <li>
                    <Link to="/service-details">Fuel injector</Link>
                    <span>(03)</span>
                  </li>
                  <li>
                    <Link to="/service-details">Find your product</Link>
                    <span>(03)</span>
                  </li>
                </ul>
              </div>
              <div className="widget widget_price_filter  ">
                <h4 className="widget_title">Filter By Price</h4>
                <div style={{ width: "220px", margin: "20px" }}>
                  <Slider
                    range
                    min={0}
                    max={600}
                    defaultValue={[0, 100]}
                    value={range}
                    onChange={handleRangeChange}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  ></div>
                </div>
                <div className="price_slider_wrapper">
                  <div className="price_slider" />
                  <div className="price_label">
                    Price: <span className="from">${range[0]}</span> —{" "}
                    <span className="to">${range[1]}</span>
                    <button type="submit" className="button btn">
                      Filter
                    </button>
                  </div>
                </div>
              </div>
              <div className="widget product_ratting_widget">
                <h3 className="widget_title">Sort by Raiting</h3>
                <ul>
                  <li>
                    <span className="star-rating">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star unavailable" />
                    </span>
                    <span>(12)</span>
                  </li>
                  <li>
                    <span className="star-rating">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star unavailable" />
                      <i className="fas fa-star unavailable" />
                    </span>
                    <span>(5)</span>
                  </li>
                  <li>
                    <span className="star-rating">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star unavailable" />
                      <i className="fas fa-star unavailable" />
                      <i className="fas fa-star unavailable" />
                    </span>
                    <span>(3)</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopArea;
