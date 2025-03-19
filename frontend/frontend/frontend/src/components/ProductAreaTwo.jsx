import React from "react";
import { Link } from "react-router-dom";

const ProductAreaTwo = () => {
  return (
    <div className="product-area-2 space-top1 overflow-hidden">
      <div className="container">
        <div className="mb-50">
          <div className="row gy-4 justify-content-lg-between justify-content-center align-items-center text-lg-start text-center">
            <div className="col-lg-6">
              <div className="title-area mb-0">
                <h3 className="sec-title mb-0">Trending Products</h3>
              </div>
            </div>
            <div className="col-auto">
              <div className="sec-btn">
                <Link to="/shop" className="btn style-border2">
                  See More
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row gy-30 gx-30 justify-content-center tr-products">
          <div className="col-xxl-4 col-lg-6">
            
            <div className="product-card list-view">
              <div className="product-img">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/img/update-img/product/1-1.png`}
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
          <div className="col-xxl-4 col-lg-6">
            <div className="product-card list-view">
              <div className="product-img">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/img/update-img/product/1-2.png`}
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
          <div className="col-xxl-4 col-lg-6">
            <div className="product-card list-view">
              <div className="product-img">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/img/update-img/product/1-3.png`}
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

          <div className="col-xxl-4 col-lg-6">
            <div className="product-card list-view">
              <div className="product-img">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/img/update-img/product/1-4.png`}
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
          <div className="col-xxl-4 col-lg-6">
            <div className="product-card list-view">
              <div className="product-img">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/img/update-img/product/1-5.png`}
                  alt="Fixturbo"
                />
                <span className="tag">
                  <span className="offer-tag">-20%</span>
                </span>
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
          <div className="col-xxl-4 col-lg-6">
            <div className="product-card list-view">
              <div className="product-img">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/img/update-img/product/1-6.png`}
                  alt="Fixturbo"
                />
              </div>
              <div className="product-content">
                <h3 className="product-title">
                  <Link to="/shop-details">Oil filter</Link>
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
      </div>
    </div>
  );
};

export default ProductAreaTwo;
