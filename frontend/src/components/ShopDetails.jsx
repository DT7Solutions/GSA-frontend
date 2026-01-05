import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import Swal from "sweetalert2";
import API_BASE_URL from "../config";
import { CartContext } from "../context/CartContext";

const ShopDetails = () => {
  const { id } = useParams();
  const token = localStorage.getItem("accessToken");
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // Use CartContext
  const { fetchCartCount } = useContext(CartContext);

  // Fetch product details
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const response = await axios.get(
          `${API_BASE_URL}api/home/car_part_detail_list/${id}/`,
          config
        );

        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product list:", error);
      }
    };

    fetchProductList();
  }, [id, token]);

  // Fetch related products from the same part section
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoadingRelated(true);
        
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        // Fetch products from the same part section using the new endpoint
        const response = await axios.get(
          `${API_BASE_URL}api/home/related-products/${id}/`,
          config
        );

        setRelatedProducts(response.data);
      } catch (error) {
        console.error("Error fetching related products:", error);
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    if (id) {
      fetchRelatedProducts();
    }
  }, [id, token]);

  // Add to cart handler
  const handleAddToCart = async (partId) => {
    if (!token) {
      Swal.fire({
        title: "You need to login first",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}api/home/cart/add/${partId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchCartCount();

      Swal.fire({
        title: "Added to cart",
        text: "Product has been added to your cart.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        title: "Error",
        text: "Unable to add product to cart.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (!product) return (
    <div className="container py-5">
      <p className="text-center">Loading product details...</p>
    </div>
  );

  return (
    <section className="product-details space-top">
      <div className="container">
        <div className="row gx-80">
          <div className="col-lg-6">
            <div className="product-thumb">
              <div className="img">
                <img
                  src={
                    product[0].product_image ||
                    "/assets/img/update-img/product/product-inner.png"
                  }
                  alt={product[0].product_name || "Product"}
                />
              </div>
              <div className="product-tag">Sale</div>
            </div>
          </div>
          <div className="col-lg-6 align-self-center">
            <div className="product-about">
              <h6 className="product-title">{product[0].product_name}</h6>
              <p className="price">
                ₹{product[0].sale_price}{" "}
                {product[0].price && <del>₹{product[0].price}</del>}
              </p>
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
                Choosing the right rim involves considering factors such as the
                vehicle type, intended use, and personal preferences for style
                performance. Regular maintenance, including cleaning and proper
                care, is important to preserve the appearance and functionality
                of car rims.
              </p>

              <button
                className="btn style2"
                onClick={() => handleAddToCart(product[0].id)}
              >
                Add to Cart
              </button>

              {/* Extra Product Meta */}
              <div className="product_meta border-top-dotted border-bottom-dotted pt-30 pb-30">
                <span className="sku_wrapper">
                  Brand Name: <span className="sku">{product[0].car_make.name}</span>
                </span>
                <span className="sku_wrapper">
                  Model Name: <span className="sku">{product[0].car_model.name}</span>
                </span>
                <span className="sku_wrapper">
                  SKU: <span className="sku">{product[0].sku}</span>
                </span>
                <span className="posted_in">
                  Category: <span>{product[0].part_section.name}</span>
                </span>
                <span>
                  Vendor: <span> Gowrisankar agencies</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="product-tab-area">
          <ul className="nav product-tab-style1" id="productTab" role="tablist">
            <li className="nav-item" role="presentation">
              
              <a  className="nav-link active"
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
            </div>
          </div>
        </div>

        {/*==============================
        Related Products from Same Part Section
        ==============================*/}
        <div className="space-extra-top space-bottom">
          <div className="row justify-content-between">
            <div className="col-md-6">
              <div className="title-area">
                <h6 className="sec-title">
                  Related Products from {product[0].part_section.name}
                </h6>
              </div>
            </div>
            <div className="col-md-auto ">
              <div className="sec-btn mb-40">
               <Link
  to={`/shop/${product[0].part_group.id}`}
  className="btn style-border2"
>
  See More
</Link>

              </div>
            </div>
          </div>

          {loadingRelated ? (
            <div className="text-center py-4">
              <p>Loading related products...</p>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="row global-carousel" id="productCarousel">
              <Swiper
                loop={relatedProducts.length > 1}
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
                {relatedProducts.map((relatedProduct) => (
                  <SwiperSlide key={relatedProduct.id}>
                    <div>
                      <div className="product-card style2">
                        <div className="product-img">
                          <img
                            src={
                              relatedProduct.product_image ||
                              "/assets/img/update-img/product/product-inner.png"
                            }
                            alt={relatedProduct.product_name || "Product"}
                          />
                        </div>
                       <div className="product-content ">
                                                    <h3 className="product-title">
                                                      <Link to={`/shop-details/${relatedProduct.id}`}>
                                                        {relatedProduct.product_name || "Unnamed Product"}
                                                      </Link>
                                                    </h3>
                                                    <div className="product-footer">
                                                      
                                                    <span className="price">
                                                      <del>₹{relatedProduct.price}</del> ₹{relatedProduct.sale_price}{" "}
                                                      &nbsp;
                                                    </span>
                      
                                                    <Link
                                                      to="#"
                                                      className="link-btn mt-0"
                                                      onClick={() => handleAddToCart(relatedProduct.id)}
                                                    >
                                                      {" "}
                                                      <i className="fas fa-shopping-cart me-2" />
                                                    </Link>
                                                     </div>
                                                  </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="text-center py-4">
              <p>No related products available in this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopDetails;