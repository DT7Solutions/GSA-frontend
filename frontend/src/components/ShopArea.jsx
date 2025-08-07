import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";


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

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  const handleAddToCart = async (partId) => {

    const token = localStorage.getItem('accessToken');

    if (!token || !isTokenValid(token)) {
      Swal.fire({
        title: "Your session has expired. Please login again",
        text: "",
        icon: "error",
        confirmButtonText: "OK",
      });
      localStorage.setItem("redirectAfterLogin", window.location.href);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      window.location.href = '#/login';
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}api/home/cart/add/${partId}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: "Successfully added to cart",
        text: "Your product was added to the cart.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
      // window.location.reload();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "There was an issue adding the product to the cart.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };


  const [categories, setCategories] = useState([]);


  useEffect(() => {
    const fetchVariantData = async () => {
      const selectedBrand = JSON.parse(localStorage.getItem("selected_brand"));
      if (selectedBrand && selectedBrand.model_variant) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}api/home/car_variant_category_group/${selectedBrand.model_variant}/`
          );
          setCategories(response.data);
        } catch (error) {
          console.error("Error fetching part sections:", error);
        }
      }
    };

    fetchVariantData();
  }, []);

  //  useEffect(() => {
  //     const fetchCarMakes = async () => {
  //       try {
  //         const response = await axios.get(`${API_BASE_URL}api/home/model_variant_item/${4}/`);
  //         setCategories(response.data);
  //       } catch (error) {
  //         console.error('Error fetching car makes:', error);
  //       }
  //     };

  //     fetchCarMakes();
  //   }, []);


  const handleCategoryClick = (categoryId) => {
    const selectedBrand = JSON.parse(localStorage.getItem("selected_brand")) || {};
    selectedBrand.brand_category = categoryId;
    localStorage.setItem("selected_brand", JSON.stringify(selectedBrand));
  };


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
                        <Link to="#" className="link-btn" onClick={() => handleAddToCart(product.id)}>
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
              {/* <div className="widget widget_search">
                <h3 className="widget_title">Search</h3>
                <form className="search-form">
                  <input type="text" placeholder="Find your product" />
                  <button type="submit">
                    <i className="fas fa-search" />
                  </button>
                </form>
              </div> */}

              <div className="widget widget_categories">
                <h3 className="widget_title">Product categories</h3>
                <ul>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          to={`/shop/${category.id}`}
                          onClick={() => handleCategoryClick(category.id)}
                        >
                          {category.name}-({category.part_count})
                        </Link>
                      </li> 
                    ))
                  ) : (
                    <li>No categories available</li>
                  )}
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

              {/* <div className="widget product_ratting_widget">
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
              </div> */}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopArea;
