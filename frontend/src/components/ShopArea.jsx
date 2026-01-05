import React, { useState, useEffect, useContext } from "react";
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
  const [productsPerPage, setProductsPerPage] = useState(9);

  const [carMakes, setCarMakes] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [modelVariant, setModelVariant] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("latest");

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");

  const [selectedBrandName, setSelectedBrandName] = useState("");
  const [selectedModelName, setSelectedModelName] = useState("");
  const [selectedVariantName, setSelectedVariantName] = useState("");
  const { fetchCartCount } = useContext(CartContext);

  const [categories, setCategories] = useState([]);
  const [partGroups, setPartGroups] = useState([]);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [partGroupsByCategory, setPartGroupsByCategory] = useState({});
  const [expandedPartGroupId, setExpandedPartGroupId] = useState(null);
  const [partItemsByGroup, setPartItemsByGroup] = useState({});
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedPartGroupName, setSelectedPartGroupName] = useState("");

  // New state for part group details
  const [partGroupDetails, setPartGroupDetails] = useState(null);

  // Enquiry form state
  const [enquiryFormData, setEnquiryFormData] = useState({
    name: "",
    phone: "",
    carBrand: "",
    carModel: "",
    modelYear: "",
    chassisNumber: "",
    message: "",
  });

  const token = localStorage.getItem("accessToken");

  // Fetch part group details when id changes
  useEffect(() => {
    const fetchPartGroupDetails = async () => {
      if (!id) return;
      
      try {
        const response = await axios.get(`${API_BASE_URL}api/home/part-group/${id}/`);
        const data = response.data;
        setPartGroupDetails(data);
        
        // Auto-select dropdowns based on part group data
        if (data.car_make) {
          setSelectedBrand(data.car_make.id);
          setSelectedBrandName(data.car_make.name);
          
          // Fetch models for the selected brand
          const modelsResponse = await axios.get(
            `${API_BASE_URL}api/home/car-models/${data.car_make.id}/`
          );
          setCarModels(modelsResponse.data);
        }
        
        if (data.car_model) {
          setSelectedModel(data.car_model.id);
          setSelectedModelName(data.car_model.name);
          
          // Fetch variants for the selected model
          const variantsResponse = await axios.get(
            `${API_BASE_URL}api/home/car_variant/${data.car_model.id}/`
          );
          setModelVariant(variantsResponse.data);
        }
        
        if (data.car_variant) {
          setSelectedVariant(data.car_variant.id);
          setSelectedVariantName(data.car_variant.name);
          
          // Fetch categories for the selected variant
          fetchCategoriesByVariant(data.car_variant.id);
        }

        // Auto-expand the category that contains this part group
        if (data.part_section) {
          setExpandedCategoryId(data.part_section.id);
          setSelectedCategoryName(data.part_section.name);
          console.log("Expanding category ID:", data.part_section.id);
          
          // Fetch part groups for this category
          const partGroupsResponse = await axios.get(
            `${API_BASE_URL}api/home/part_groups_list/${data.part_section.id}/`
          );
          setPartGroupsByCategory((prev) => ({
            ...prev,
            [data.part_section.id]: partGroupsResponse.data,
          }));
          
          // Auto-expand this specific part group
          setExpandedPartGroupId(parseInt(id));
          setSelectedPartGroupName(data.name);
          
          // Fetch part items for this part group
          const partItemsResponse = await axios.get(
            `${API_BASE_URL}api/home/car_part_items/${id}/`
          );
          setPartItemsByGroup((prev) => ({
            ...prev,
            [id]: partItemsResponse.data,
          }));
        }
      } catch (error) {
        console.error("Error fetching part group details:", error);
      }
    };

    fetchPartGroupDetails();
  }, [id]);

  // Update enquiry form when brand/model/variant changes
  useEffect(() => {
    setEnquiryFormData((prev) => ({
      ...prev,
      carBrand: selectedBrandName || "",
      carModel: selectedModelName || "",
      modelYear: selectedVariantName || "",
    }));
  }, [selectedBrandName, selectedModelName, selectedVariantName]);

  const handleEnquiryChange = (e) => {
    setEnquiryFormData({ ...enquiryFormData, [e.target.name]: e.target.value });
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");

    if (!token || !isTokenValid(token)) {
      Swal.fire({
        title: "Please login to submit enquiry",
        icon: "error",
        confirmButtonText: "OK",
      });
      localStorage.setItem("redirectAfterLogin", window.location.href);
      window.location.href = "#/login";
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}api/home/product_enquiry/`, enquiryFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Swal.fire("Success!", "Your enquiry has been submitted successfully.", "success");
      
      setEnquiryFormData({
        name: "",
        phone: "",
        carBrand: selectedBrandName || "",
        carModel: selectedModelName || "",
        modelYear: selectedVariantName || "",
        chassisNumber: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      Swal.fire("Error", "Something went wrong while submitting your enquiry.", "error");
    }
  };

  const handleRangeChange = (value) => {
    setRange(value);
    const [min, max] = value;
    const filtered = productData.filter(
      (item) => item.price >= min && item.price <= max
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  // Sort products based on selected option
  const sortProducts = (products, sortType) => {
    const sorted = [...products];
    
    switch (sortType) {
      case "price-low-high":
        return sorted.sort((a, b) => a.sale_price - b.sale_price);
      case "price-high-low":
        return sorted.sort((a, b) => b.sale_price - a.sale_price);
      case "latest":
      default:
        return sorted.sort((a, b) => b.id - a.id);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoadingProducts(true);
        setProductData([]);
        setFilteredProducts([]);
        
        const response = await axios.get(`${API_BASE_URL}api/home/car_part_items/${id}/`);
        setProductData(response.data);
        setFilteredProducts(response.data);
        
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching car parts:", error);
        setProductData([]);
        setFilteredProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  // Apply sorting when sortBy changes
  useEffect(() => {
    const sorted = sortProducts(filteredProducts, sortBy);
    setFilteredProducts(sorted);
    setCurrentPage(1);
  }, [sortBy]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const maxPrice = productData.length > 0 ? Math.max(...productData.map((p) => p.price)) : 1000;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

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

  const fetchCategoriesByVariant = async (variantId) => {
    if (!variantId) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}api/home/car_part_count_part_group_count/${variantId}/`
      );
      setCategories(response.data);

      const selectedBrandLS =
        JSON.parse(localStorage.getItem("selected_brand")) || {};
      selectedBrandLS.model_variant = variantId;
      localStorage.setItem("selected_brand", JSON.stringify(selectedBrandLS));
    } catch (error) {
      console.error("Error fetching part sections:", error);
    }
  };

  useEffect(() => {
    const selectedBrandLS = JSON.parse(localStorage.getItem("selected_brand"));
    if (selectedBrandLS?.model_variant && !partGroupDetails) {
      setSelectedVariant(selectedBrandLS.model_variant);
      fetchCategoriesByVariant(selectedBrandLS.model_variant);
    }
  }, [partGroupDetails]);

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
      setCarModels(response.data);
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  };

  const handleCarModelChange = async (modelId) => {
    const selectedModelObj = carModels.find(
      (model) => model.id.toString() === modelId.toString()
    );
    setSelectedModel(modelId);
    setSelectedModelName(selectedModelObj ? selectedModelObj.name : "");
    setSelectedVariant("");
    setSelectedVariantName("");
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

  const handleVariantChange = (variantId) => {
    const selectedVariantObj = modelVariant.find(
      (variant) => variant.id.toString() === variantId.toString()
    );
    setSelectedVariant(variantId);
    setSelectedVariantName(selectedVariantObj ? selectedVariantObj.name : "");
    fetchCategoriesByVariant(variantId);
  };

  const handleCategoryClick = async (category) => {
  // Always store selected category name
  setSelectedCategoryName(category.name);
  setSelectedPartGroupName(""); // reset only part group

  // Toggle collapse
  if (expandedCategoryId === category.id) {
    setExpandedCategoryId(null);
    setExpandedPartGroupId(null);
    return;
  }

  // Expand new category
  setExpandedCategoryId(category.id);
  setExpandedPartGroupId(null);

  if (partGroupsByCategory[category.id]) return;

  try {
    const response = await axios.get(
      `${API_BASE_URL}api/home/part_groups_list/${category.id}/`
    );
    setPartGroupsByCategory((prev) => ({
      ...prev,
      [category.id]: response.data,
    }));
  } catch (error) {
    console.error("Error fetching part groups:", error);
  }
};


  const handlePartGroupClick = async (groupId, groupName) => {
  // Always store selected part group name
  setSelectedPartGroupName(groupName);

  // Toggle collapse
  if (expandedPartGroupId === groupId) {
    setExpandedPartGroupId(null);
    return;
  }

  setExpandedPartGroupId(groupId);

  if (partItemsByGroup[groupId]) return;

  try {
    const response = await axios.get(
      `${API_BASE_URL}api/home/car_part_items/${groupId}/`
    );
    setPartItemsByGroup((prev) => ({
      ...prev,
      [groupId]: response.data,
    }));
  } catch (error) {
    console.error("Error fetching part items:", error);
    setPartItemsByGroup((prev) => ({
      ...prev,
      [groupId]: [],
    }));
  }
};

  return (
    <section className="space-top space-extra-bottom shop-sec">
      <div className="container">
        <div className="row flex-row-reverse">
          <div className="col-xl-9 col-lg-8 order-lg-1 order-2 mb-5">
            {isLoadingProducts ? (
              <div
                className="text-center my-5"
                style={{
                  minHeight: "300px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {currentProducts.length > 0 ? (
                  <>
                    {/* Product Count and Sort Options Bar */}
                    <div className="d-flex justify-content-between align-items-center flex-wrap mb-5 p-3 bg-light rounded">
                      <div className="product-count">
                        <p className="mb-0">
                          Showing <strong>{indexOfFirstProduct + 1}</strong> to{" "}
                          <strong>
                            {Math.min(indexOfLastProduct, filteredProducts.length)}
                          </strong>{" "}
                          of <strong>{filteredProducts.length}</strong> products
                        </p>
                      </div>

                      <div className="d-flex gap-3 align-items-center show-num">
                        {/* Products Per Page */}
                        <div className="d-flex align-items-center gap-2">
                          <label htmlFor="perPage" className="mb-0 text-nowrap">
                            Show:
                          </label>
                          <select
                            id="perPage"
                            className=""
                            style={{ width: "80px" }}
                            value={productsPerPage}
                            onChange={handleProductsPerPageChange}
                          >
                            <option value={9}>9</option>
                            <option value={12}>12</option>
                            <option value={18}>18</option>
                            <option value={24}>24</option>
                          </select>
                        </div>

                        {/* Sort By */}
                        <div className="d-flex align-items-center gap-2 show-num">
                          <label htmlFor="sortBy" className="mb-0 text-nowrap">
                            Sort by:
                          </label>
                          <select
                            id="sortBy"
                            className=""
                            style={{ width: "150px" }}
                            value={sortBy}
                            onChange={handleSortChange}
                          >
                            <option value="latest">Latest</option>
                            <option value="price-low-high">Price: Low to High</option>
                            <option value="price-high-low">Price: High to Low</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="row gy-4">
                      {currentProducts.map((product, index) => (
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
                            <div className="product-content ">
                              <h3 className="product-title">
                                <Link to={`/shop-details/${product.id}`}>
                                  {product.product_name || "Unnamed Product"}
                                </Link>
                              </h3>
                              <div className="product-footer">
                                
                              <span className="price">
                                <del>₹{product.price}</del> ₹{product.sale_price}{" "}
                                &nbsp;
                              </span>

                              <Link
                                to="#"
                                className="link-btn mt-0"
                                onClick={() => handleAddToCart(product.id)}
                              >
                                {" "}
                                <i className="fas fa-shopping-cart me-2" />
                              </Link>
                               </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="pagination mt-5 d-flex justify-content-center">
                        <ul className="pagination-list d-flex align-items-center gap-2">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() =>
                                currentPage > 1 &&
                                handlePageChange(currentPage - 1)
                              }
                            >
                              &laquo;
                            </button>
                          </li>

                          {(() => {
                            const maxVisible = 5;
                            let startPage = Math.max(
                              2,
                              currentPage - Math.floor(maxVisible / 2)
                            );
                            let endPage = Math.min(
                              totalPages - 1,
                              currentPage + Math.floor(maxVisible / 2)
                            );

                            if (currentPage <= Math.floor(maxVisible / 2)) {
                              startPage = 2;
                              endPage = Math.min(totalPages - 1, maxVisible + 1);
                            }

                            if (
                              currentPage + Math.floor(maxVisible / 2) >=
                              totalPages
                            ) {
                              startPage = Math.max(2, totalPages - maxVisible);
                              endPage = totalPages - 1;
                            }

                            const pages = [];

                            pages.push(
                              <li
                                key={1}
                                className={`page-item ${
                                  currentPage === 1 ? "active" : ""
                                }`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(1)}
                                >
                                  1
                                </button>
                              </li>
                            );

                            if (startPage > 2) {
                              pages.push(
                                <li
                                  key="start-ellipsis"
                                  className="page-item disabled"
                                >
                                  <span className="page-link">…</span>
                                </li>
                              );
                            }

                            for (let i = startPage; i <= endPage; i++) {
                              pages.push(
                                <li
                                  key={i}
                                  className={`page-item ${
                                    currentPage === i ? "active" : ""
                                  }`}
                                >
                                  <button
                                    className="page-link"
                                    onClick={() => handlePageChange(i)}
                                  >
                                    {i}
                                  </button>
                                </li>
                              );
                            }

                            if (endPage < totalPages - 1) {
                              pages.push(
                                <li
                                  key="end-ellipsis"
                                  className="page-item disabled"
                                >
                                  <span className="page-link">…</span>
                                </li>
                              );
                            }

                            if (totalPages > 1) {
                              pages.push(
                                <li
                                  key={totalPages}
                                  className={`page-item ${
                                    currentPage === totalPages ? "active" : ""
                                  }`}
                                >
                                  <button
                                    className="page-link"
                                    onClick={() => handlePageChange(totalPages)}
                                  >
                                    {totalPages}
                                  </button>
                                </li>
                              );
                            }

                            return pages;
                          })()}

                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() =>
                                currentPage < totalPages &&
                                handlePageChange(currentPage + 1)
                              }
                            >
                              &raquo;
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  // Enquiry Form when no products found
                  <div className="">
                    <div className="card-body p-4">
                      <div className="text-center mb-5">
                        <i
                          className="fas fa-search"
                          style={{ fontSize: "3rem", color: "#6c757d" }}
                        ></i>
                        <h4 className="mt-3">No Products Found</h4>
                        <p className="text-muted">
                          We couldn't find any car parts matching your search.
                          Please submit an enquiry and we'll help you find what
                          you need.
                        </p>
                      </div>

                      <form
                        className="comment-form bg-light p-4 rounded card shadow-sm"
                        onSubmit={handleEnquirySubmit}
                      >
                        <h5 className="mb-4 text-center">Submit Product Enquiry</h5>
                        <div className="row p-lg-5 p-3">
                          <div className="col-md-6 form-group mb-3">
                            <input
                              type="text"
                              placeholder="Your Name *"
                              name="name"
                              required
                              className="form-control"
                              value={enquiryFormData.name}
                              onChange={handleEnquiryChange}
                            />
                          </div>
                          <div className="col-md-6 form-group mb-3">
                            <input
                              type="text"
                              name="phone"
                              placeholder="Phone Number *"
                              className="form-control"
                              required
                              value={enquiryFormData.phone}
                              onChange={handleEnquiryChange}
                            />
                          </div>
                          <div className="col-md-6 form-group mb-3">
                            <input
                              type="text"
                              name="carBrand"
                              placeholder="Car Brand *"
                              className="form-control"
                              required
                              value={enquiryFormData.carBrand}
                              onChange={handleEnquiryChange}
                            />
                          </div>
                          <div className="col-md-6 form-group mb-3">
                            <input
                              type="text"
                              name="carModel"
                              placeholder="Car Model *"
                              className="form-control"
                              required
                              value={enquiryFormData.carModel}
                              onChange={handleEnquiryChange}
                            />
                          </div>
                          <div className="col-md-6 form-group mb-3">
                            <input
                              type="text"
                              name="modelYear"
                              placeholder="Model Year / Variant"
                              className="form-control"
                              value={enquiryFormData.modelYear}
                              onChange={handleEnquiryChange}
                            />
                          </div>
                          <div className="col-md-6 form-group mb-3">
                            <input
                              type="text"
                              name="chassisNumber"
                              placeholder="Chassis Number (Optional)"
                              className="form-control"
                              value={enquiryFormData.chassisNumber}
                              onChange={handleEnquiryChange}
                            />
                          </div>
                          <div className="col-12 form-group mb-3">
                            <textarea
                              placeholder="Tell us what car part you're looking for..."
                              name="message"
                              className="form-control"
                              rows="4"
                              value={enquiryFormData.message}
                              onChange={handleEnquiryChange}
                            ></textarea>
                          </div>
                          <div className="col-12 form-group mb-0">
                            <button className="btn btn-primary w-100" type="submit">
                              Submit Enquiry
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="col-xl-3 col-lg-4 sidebar-widget-area order-lg-2 order-1 mb-5">
            <aside className="sidebar-sticky-area sidebar-area sidebar-shop">
              <div className="bg-white rounded shadow-sm">
                <h3 className="widget_title bg-theme-sidebar p-3 mb-3">
                  Search by Car Brand
                </h3>
                <div className="brand p-3">
                  <select
                    className="mb-3 text-center"
                    value={selectedBrand}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedMake = carMakes.find(
                        (make) => make.id.toString() === selectedId
                      );
                      handleCarMakeChange(
                        selectedId,
                        selectedMake ? selectedMake.name : ""
                      );
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
                    className="mb-3 text-center"
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
                    className="mb-3 text-center"
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
                    {selectedBrandName && selectedModelName && selectedVariantName
                      ? `${selectedBrandName} > ${selectedModelName} > ${selectedVariantName}`
                      : "Please select all options"}
                  </div>
                </div>
              </div>

              <div className="widget widget_categories hyperlink mt-5 bg-white rounded shadow-sm border p-0">
                <h3 className="widget_title mb-3 border-bottom fw-bold text-dar p-3 bg-theme-sidebar">
                  Product Categories
                </h3>
                <ul className="category-list list-unstyled mb-0 p-3">
                  
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <li key={category.id} className="mb-3">
                        <div
                          className="category-card sidebar-point d-flex justify-content-between align-items-center  rounded border hover-shadow"
                          onClick={() => handleCategoryClick(category)}


                          style={{ cursor: "pointer" }}
                        >
                          <span className="fw-semibold text-dark">
                            {category.name}{" "}
                            <span className="text-muted">
                              ({category.part_groups_count})
                            </span>
                          </span>
                          <span className="toggle-square">
                            {expandedCategoryId === category.id ? "⊟" : "⊞"}
                          </span>
                        </div>

                        {expandedCategoryId === category.id &&
                          partGroupsByCategory[category.id] &&
                          partGroupsByCategory[category.id].length > 0 && (
                            <ul className="part-group-list list-unstyled ps-3 mt-2">
                              {partGroupsByCategory[category.id].map((group) => (
                                <li key={group.id} className="mb-3 mt-3">
                                  <div
                                    className="part-group-card d-flex justify-content-between align-items-center p-2 rounded border hover-bg-light"
                                    onClick={() => handlePartGroupClick(group.id, group.name)}

                                    style={{ cursor: "pointer" }}
                                  >
                                    <Link
                                      to={`/shop/${group.id}`}
                                      className="text-decoration-none text-secondary fw-medium sidebar-point mb-0"
                                    >
                                      {group.name}
                                    </Link>
                                    <span className="toggle-square sidebar-point">
                                      {expandedPartGroupId === group.id
                                        ? "⊟"
                                        : "⊞"}
                                    </span>
                                  </div>

                                  {expandedPartGroupId === group.id &&
                                    partItemsByGroup[group.id] &&
                                    partItemsByGroup[group.id].length > 0 && (
                                      <ul className="part-item-list bg-color-list list-unstyled ps-4 py-3">
                                        {partItemsByGroup[group.id].map((item) => (
                                          <li key={item.id} className="pb-1">
                                            <Link
                                              to={`/shop-details/${item.id}`}
                                              className="text-decoration-none text-muted hover-text-dark mb-2 pb-3 px-3"
                                            >
                                              {item.product_name || item.name}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                </li>
                              ))}
                            </ul>
                          )}
                      </li>
                    ))
                  ) : (
                    <li>No categories available</li>
                  )}
                </ul>
              </div>

              <div className="widget widget_price_filter bg-white">
                <h4 className="widget_title">Filter By Price</h4>
                <div style={{ width: "220px", margin: "20px" }}>
                  <Slider
                    range
                    min={0}
                    max={maxPrice}
                    defaultValue={[0, maxPrice]}
                    value={range}
                    onChange={handleRangeChange}
                  />
                </div>
                <div className="price_slider_wrapper">
                  <div className="price_label">
                    Price: <span className="from">₹{range[0]}</span> —{" "}
                    <span className="to">₹{range[1]}</span>
                    <button
                      type="button"
                      className="p-0"
                      onClick={() => handleRangeChange(range)}
                    >
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