import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

const ShopArea = ({ id }) => {
  const [range, setRange] = useState([0, 100]);
  const [productData, setProductData] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");

  const handleRangeChange = (value) => {
    setRange(value);
  };

useEffect(() => {
  const fetchProductData = async () => {
    try {
     const response = await axios.get(
          `${API_BASE_URL}api/home/car_part_group_list/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      setProductData(response.data);
      console.log('got car-models payload:', response.data);
    } catch (error) {
      console.error('Error fetching car parts:', error);
    }
  };

  if (id) {
    fetchProductData();
  }
}, [id]);




 

  return (
    <section className="space-top space-extra-bottom shop-sec">
      <div className="container">
        <div className="row flex-row-reverse">
          <div className="col-xl-9 col-lg-8">
            <div className="row gy-4">
              {productData && productData.length > 0 ? (
                productData.map((product, index) => (
                  <div className="col-xl-4 col-md-6" key={index}>
                    <div className="product-card style2">
                      <div className="product-img">
                        <img
                          src={product.product_image || "/assets/img/update-img/product/1-1.png"}
                          alt={product.product_name || "Product"}
                        />
                      </div>
                      <div className="product-content">
                        <h3 className="product-title">
                          <Link to={`/shop-details/${product.id}`}>
                            {product.product_name || "Unnamed Product"}
                          </Link>
                        </h3>
                        {/* <span className="star-rating">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star ${i >= (product.rating || 0) ? "unavailable" : ""
                                }`}
                            />
                          ))}
                        </span> */}
                        <span className="price">
                          {/* {product.discount > 0 && (
                           
                          )}{" "} */}
                           ₹{product.sale_price} &nbsp;
                          <del>₹{product.price}</del>
                        </span>
                        <Link to="#" className="link-btn">
                          Add to cart <i className="fas fa-arrow-right" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found.</p>
              )}

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

              <div className="widget widget_categories">
                <h3 className="widget_title">Product categories</h3>
                <ul>
                  <li>
                    <Link to="/service-details">Steering wheel</Link> <span>(12)</span>
                  </li>
                  <li>
                    <Link to="/service-details">Suspension spring</Link> <span>(12)</span>
                  </li>
                  <li>
                    <Link to="/service-details">Tail light</Link> <span>(08)</span>
                  </li>
                  <li>
                    <Link to="/service-details">Transmission</Link> <span>(13)</span>
                  </li>
                  <li>
                    <Link to="/service-details">Windshield wiper motor</Link> <span>(03)</span>
                  </li>
                  <li>
                    <Link to="/service-details">Fuel injector</Link> <span>(03)</span>
                  </li>
                </ul>
              </div>

              <div className="widget widget_price_filter">
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
                </div>
                <div className="price_slider_wrapper">
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
                <h3 className="widget_title">Sort by Rating</h3>
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
