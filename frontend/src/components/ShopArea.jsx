import React, { useState, useEffect,useContext } from "react";
import Slider from "rc-slider";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { CartContext } from "../context/CartContext";

const ShopArea = ({ id }) => {
  const [range, setRange] = useState([0, 100]);
  const [productData, setProductData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const [carMakes, setCarMakes] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [modelVariant, setModelVariant] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");

  const [selectedBrandName, setSelectedBrandName] = useState("");
  const [selectedModelName, setSelectedModelName] = useState("");
  const [selectedVariantName, setSelectedVariantName] = useState("");
   const { fetchCartCount } = useContext(CartContext);

  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("accessToken");

  const handleRangeChange = (value) => {
    setRange(value);
  };

  // Fetch product data based on id
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}api/home/car_part_group_list/${id}/`
        );
        setProductData(response.data);
      } catch (error) {
        console.error("Error fetching car parts:", error);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productData.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

const totalPages = Math.ceil(productData.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
      })
    } catch {
      Swal.fire({
        title: "Error",
        text: "There was an issue adding the product to the cart.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Fetch categories based on variant id
  const fetchCategoriesByVariant = async (variantId) => {
    if (!variantId) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}api/home/car_variant_category_group/${variantId}/`
      );
      setCategories(response.data);

      // Update localStorage
      const selectedBrandLS =
        JSON.parse(localStorage.getItem("selected_brand")) || {};
      selectedBrandLS.model_variant = variantId;
      localStorage.setItem("selected_brand", JSON.stringify(selectedBrandLS));
    } catch (error) {
      console.error("Error fetching part sections:", error);
    }
  };

  // Load categories from localStorage on page load
  useEffect(() => {
    const selectedBrandLS = JSON.parse(localStorage.getItem("selected_brand"));
    if (selectedBrandLS?.model_variant) {
      setSelectedVariant(selectedBrandLS.model_variant);
      fetchCategoriesByVariant(selectedBrandLS.model_variant);
    }
  }, []);

  // Fetch car makes
  useEffect(() => {
    const fetchCarMakes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/home/car-makes/`);
        setCarMakes(response.data);
      } catch (error) {
        console.error("Error fetching car makes:", error);
      }
    };

    fetchCarMakes();
  }, []);

  // Handle Brand change
  const handleCarMakeChange = async (brandId, brandname) => {
    setSelectedBrand(brandId);
    setSelectedBrandName(brandname);
    setCarModels([]);
    setSelectedModel("");
    setSelectedVariant("");
    setModelVariant([]);
    setCategories([]);
    try {
      const response = await axios.get(
        `${API_BASE_URL}api/home/car-models/${brandId}/`
      );
      debugger
      setCarModels(response.data);
     
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  };

  // Handle Model change
  const handleCarModelChange = async (modelId) => {
    setSelectedModel(modelId);
    setSelectedVariant("");
    setModelVariant([]);
    setCategories([]);
    try {
      const response = await axios.get(
        `${API_BASE_URL}api/home/car_variant/${modelId}/`
      );
      setModelVariant(response.data);
    } catch (error) {
      console.error("Error fetching car variants:", error);
    }
  };

  // Handle Variant change
  const handleVariantChange = (variantId) => {
    setSelectedVariant(variantId);
    fetchCategoriesByVariant(variantId);
  };

  // Handle Category click
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
              {currentProducts.length > 0 ? (
                currentProducts.map((product, index) => (
                  <div className="col-xl-4 col-md-6 col-6" key={index}>
                    <div className="product-card style2">
                      <div className="product-img">
                         <Link to={`/shop-details/${product.id}`}>
                        <img
                          src={
                            product.product_image ||
                            "/assets/img/update-img/product/1-1.png"
                          }
                          alt={product.product_name || "Product"}
                        />
                        </Link>
                      </div>
                      <div className="product-content">
                        <h3 className="product-title">
                          <Link to={`/shop-details/${product.id}`}>
                            {product.product_name || "Unnamed Product"}
                          </Link>
                        </h3>
                        <span className="price">
                          ₹{product.sale_price} &nbsp;
                          <del>₹{product.price}</del>
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
                <p>No products found.</p>
              )}
            </div>
             {/* ---- Pagination UI ---- */}
            {totalPages > 1 && (
              <div className="pagination mt-5">
                <ul className="pagination-list d-flex gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="col-xl-3 col-lg-4 sidebar-widget-area">
            <aside className="sidebar-sticky-area sidebar-area sidebar-shop">
              <div>
                <h3 className="widget_title">Search by Car Brand</h3>

                <select
                  className="mb-2"
                  value={selectedBrand}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedMake = carMakes.find(make => make.id.toString() === selectedId);
                    handleCarMakeChange(selectedId, selectedMake ? selectedMake.name : "");
                  }}
                >
                  <option value="">-- Select Your Car --</option>
                  {carMakes.map((make) => (
                    <option key={make.id} value={make.id}>
                      {make.name}
                    </option>
                  ))}
                </select>


                <select
                  className="mb-2"
                  value={selectedModel}
                  onChange={(e) => handleCarModelChange(e.target.value)}
                  disabled={!selectedBrand}
                >
                  <option value="">-- Select Model --</option>
                  {carModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>

                <select
                  className="mb-2"
                  value={selectedVariant}
                  onChange={(e) => handleVariantChange(e.target.value)}
                  disabled={!selectedModel}
                >
                  <option value="">-- Select Variant --</option>
                  {modelVariant.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name}
                    </option>
                  ))}
                </select>

                <div style={{ marginTop: "20px" }}>
                  <strong>Selected:</strong>{" "}
                  {selectedBrand && selectedModel && selectedVariant
                    ? `${selectedBrandName} > ${selectedModel} > ${selectedVariant}`
                    : "Please select all options"}
                </div>
              </div>

              <div className="widget widget_categories mt-5">
                <h3 className="widget_title">Product categories</h3>
                <ul>
                  {categories.length > 0 ? (
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
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopArea;
