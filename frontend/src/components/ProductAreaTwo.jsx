import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { CartContext } from "../context/CartContext";

const ProductAreaTwo = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchCartCount } = useContext(CartContext);

  // Fetch any 6 car parts
  useEffect(() => {
    const fetchCarParts = async () => {
      try {
        setIsLoading(true);
        // Fetch car parts list (first 6 items)
        const response = await axios.get(`${API_BASE_URL}api/home/car-parts-list/`);
        
        // Get first 6 parts
        setTrendingProducts(response.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching car parts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarParts();
  }, []);

  // Token validation
  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

  // Add to cart handler
  const handleAddToCart = async (partId) => {
    const token = localStorage.getItem("accessToken");

    if (!token || !isTokenValid(token)) {
      Swal.fire({
        title: "Your session has expired. Please login again",
        icon: "error",
        confirmButtonText: "OK",
      });
      localStorage.setItem("redirectAfterLogin", window.location.href);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "#/login";
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}api/home/cart/add/${partId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchCartCount();
      Swal.fire({
        title: "Successfully added to cart",
        text: "Your product was added to the cart.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch {
      Swal.fire({
        title: "Error",
        text: "There was an issue adding the product to the cart.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="product-area-2 space-top1 overflow-hidden">
      <div className="container">
        <div className="mb-50">
          <div className="row gy-4 justify-content-lg-between justify-content-center align-items-center text-lg-start text-center">
            <div className="col-lg-12">
              <div className="title-area mb-0">
                <h3 className="sec-title text-center mb-0">Trending Products</h3>
              </div>
            </div>
           
          </div>
        </div>

        {isLoading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row gy-30 gx-30 justify-content-center tr-products">
            {trendingProducts.length > 0 ? (
              trendingProducts.map((product) => (
                <div className="col-xxl-4 col-lg-6" key={product.id}>
                  <div className="product-card list-view">
                    <div className="product-img">
                      <img
                        src={
                          product.product_image ||
                          `${process.env.PUBLIC_URL}/assets/img/update-img/product/1-1.png`
                        }
                        alt={product.product_name || "Car Part"}
                      />
                      {product.discount_percentage && (
                        <span className="tag">
                          <span className="offer-tag">
                            -{product.discount_percentage}%
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="product-content">
                      <h3 className="product-title">
                        <Link to={`/shop-details/${product.id}`}>
                          {product.product_name || "Unnamed Product"}
                        </Link>
                      </h3>
                      
                      <span className="price">
                        {product.price && product.sale_price && (
                          <>
                            <del>₹{product.price}</del> ₹{product.sale_price}
                          </>
                        )}
                        {!product.sale_price && product.price && (
                          <>₹{product.price}</>
                        )}
                      </span>
                      <Link
                        to="#"
                        className="link-btn"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        Add to cart <i className="fas fa-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No trending products available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductAreaTwo;