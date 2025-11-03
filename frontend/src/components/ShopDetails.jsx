// import React from "react";
// import { Link,useParams } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import API_BASE_URL from "../config";


// const handleAddToCart = async (partId) => {
// const token = localStorage.getItem("accessToken");


//   if (!token) {
//     Swal.fire({
//       title: "You need to login first",
//       icon: "warning",
//       confirmButtonText: "OK",
//     });
   
//     return;
//   }

//   try {
//     await axios.post(
//       `${API_BASE_URL}api/home/cart/add/${partId}/`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     Swal.fire({
//       title: "Added to cart",
//       text: "Product has been added to your cart.",
//       icon: "success",
//       confirmButtonText: "OK",
//     });

    
//   } catch (error) {
//     console.error("Error adding to cart:", error);
//     Swal.fire({
//       title: "Error",
//       text: "Unable to add product to cart.",
//       icon: "error",
//       confirmButtonText: "OK",
//     });
//   }
// };

//   const ShopDetails = () => {
//   const { id } = useParams();
//   const token = localStorage.getItem("accessToken");
//   const [product, setProduct] = useState(null);
 


//   useEffect(() => {
//           const fetchProductList = async () => {
//             try {
//               const response = await axios.get(`${API_BASE_URL}api/home/car_part_detail_list/${id}/`, {
//                 headers: { Authorization: `Bearer ${token}` }
//               });
//               setProduct(response.data); 
//             } catch (error) {
//               console.error('Error fetching product list:', error);
//             }
//           };
      
//           fetchProductList();
//         }, []);

//   if (!product) return <p>Loading product details...</p>;

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

  // Use CartContext
  const { fetchCartCount } = useContext(CartContext);

  // Fetch product details
 useEffect(() => {
  const fetchProductList = async () => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {}; // no header if not logged in

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

      // Immediately update cart count
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

  if (!product) return <p>Loading product details...</p>;


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
                  alt={product.product_name || "Product"}
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
                {product.price && <del>₹{product.price}</del>}
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
              
              {/* <p className="text">
               { product[0].description ||
                  "No description available for this product."}
              </p> */}
              <p className="text">Choosing the right rim involves considering factors such as the vehicle type, intended use, and personal preferences for style performance. Regular maintenance, including cleaning and proper care, is important to preserve the appearance and functionality of car rims.</p>
              
                                     <button
  className="btn style2"
  onClick={() => handleAddToCart(product[0].id)}
>Add to Cart</button>
              {/* Extra Product Meta */}
              <div className="product_meta border-top-dotted border-bottom-dotted pt-30 pb-30 ">
                {/* sku Dynamic code */}
                {/* {product.sku && (
                  <span className="sku_wrapper">
                    SKU: <span className="sku">{product.sku}</span>
                  </span>
                )} */}
                   <span className="sku_wrapper">
                    Brand Name: <span className="sku">{product[0].car_make.name}</span>
                  </span>
                   <span className="sku_wrapper">
                    Model Name: <span className="sku">{product[0].car_model.name}</span>
                  </span>
                  <span className="sku_wrapper">
                    SKU: <span className="sku">{product[0].sku}</span>
                  </span>
             {/* product category Dynamic code  */}

                {/* {product.category && (
                  <span className="posted_in">
                    Category:{" "}
                    <Link to="/shop" rel="tag">
                      {product.category}
                    </Link>
                  </span>
                )} */}
                 <span className="posted_in">
                    Category: <span>{product[0].part_section.name}</span>
                  </span>

                {/* {product.tags && product.tags.length > 0 && (
                  <span>
                    Vendor:{" "}
                    {product.tags.map((tag, idx) => (
                      <Link key={idx} to={`/shop?tag=${tag}`}>
                        {tag}
                      </Link>
                    ))}
                  </span>
                )} */}
                     
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
            {/* <li className="nav-item" role="presentation">
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
            </li> */}
            {/* <li className="nav-item" role="presentation">
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
            </li> */}
          </ul>
          <div className="tab-content" id="productTabContent">
            <div
              className="tab-pane fade show active"
              id="description"
              role="tabpanel"
              aria-labelledby="description-tab"
            >
              {/* dynamic use this code  */}
              {/* <p className="text">
               { product[0].description ||
                  "No description available for this product."}
              </p> */}
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
                  src={
                    product[0].product_image ||
                    "/assets/img/update-img/product/product-inner.png"
                  }
                  alt={product.product_name || "Product"}
                />
                    </div>
                    <div className="product-content">
                      <h3 className="product-title">
                        <Link to="/shop-details">{product[0].product_name}</Link>
                      </h3>
                      <span className="star-rating">
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                        <i className="fas fa-star" />
                      </span>
                      <span className="price">
                       
                ₹{product[0].sale_price}{" "}
                {product.price && <del>₹{product.price}</del>}
          
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
