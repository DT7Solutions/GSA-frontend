import React, { useState, useEffect, useContext } from "react";
import Slider from "rc-slider";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { CartContext } from "../context/CartContext";

const ShopArea = ({ id }) => {
  const navigate = useNavigate();
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

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPartGroup, setSelectedPartGroup] = useState("");

  const [partGroupDetails, setPartGroupDetails] = useState(null);

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
          
          const modelsResponse = await axios.get(
            `${API_BASE_URL}api/home/car-models/${data.car_make.id}/`
          );
          setCarModels(modelsResponse.data);
        }
        
        if (data.car_model) {
          setSelectedModel(data.car_model.id);
          setSelectedModelName(data.car_model.name);
          
          const variantsResponse = await axios.get(
            `${API_BASE_URL}api/home/car_variant/${data.car_model.id}/`
          );
          setModelVariant(variantsResponse.data);
        }
        
        if (data.car_variant) {
          setSelectedVariant(data.car_variant.id);
          setSelectedVariantName(data.car_variant.name);
          
          await fetchCategoriesByVariant(data.car_variant.id);
        }

        if (data.part_section) {
          setSelectedCategory(data.part_section.id);
          setSelectedCategoryName(data.part_section.name);
          
          // Fetch part groups for this category
          const partGroupsResponse = await axios.get(
            `${API_BASE_URL}api/home/part_groups_list/${data.part_section.id}/`
          );
          setPartGroups(partGroupsResponse.data);
          
          // Set selected part group
          setSelectedPartGroup(parseInt(id));
          setSelectedPartGroupName(data.name);
        }
      } catch (error) {
        console.error("Error fetching part group details:", error);
      }
    };

    fetchPartGroupDetails();
  }, [id]);

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

  const handleCarMakeChange = async (brandId, brandName = "") => {
    if (!brandId) {
      setSelectedBrand("");
      setSelectedBrandName("");
      setCarModels([]);
      setModelVariant([]);
      setCategories([]);
      setPartGroups([]);
      setSelectedModel("");
      setSelectedVariant("");
      setSelectedCategory("");
      setSelectedPartGroup("");
      setSelectedModelName("");
      setSelectedVariantName("");
      setSelectedCategoryName("");
      setSelectedPartGroupName("");
      return;
    }

    setSelectedBrand(brandId);
    
    const selectedMake = carMakes.find((make) => make.id.toString() === brandId.toString());
    setSelectedBrandName(selectedMake ? selectedMake.name : brandName);

    setSelectedModel("");
    setSelectedVariant("");
    setSelectedCategory("");
    setSelectedPartGroup("");
    setSelectedModelName("");
    setSelectedVariantName("");
    setSelectedCategoryName("");
    setSelectedPartGroupName("");

    setCarModels([]);
    setModelVariant([]);
    setCategories([]);
    setPartGroups([]);

    try {
      const response = await axios.get(
        `${API_BASE_URL}api/home/car-models/${brandId}/`
      );
      setCarModels(response.data);
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    if (!categoryId) {
      setSelectedCategory("");
      setSelectedCategoryName("");
      setSelectedPartGroup("");
      setSelectedPartGroupName("");
      setPartGroups([]);
      return;
    }

    const selectedCategoryObj = categories.find(
      (cat) => cat.id.toString() === categoryId.toString()
    );
    
    setSelectedCategory(categoryId);
    setSelectedCategoryName(selectedCategoryObj ? selectedCategoryObj.name : "");
    setSelectedPartGroup("");
    setSelectedPartGroupName("");
    setPartGroups([]);

    try {
      const response = await axios.get(
        `${API_BASE_URL}api/home/part_groups_list/${categoryId}/`
      );
      setPartGroups(response.data);
    } catch (error) {
      console.error("Error fetching part groups:", error);
    }
  };

  const handlePartGroupChange = (groupId) => {
    if (!groupId) {
      setSelectedPartGroup("");
      setSelectedPartGroupName("");
      return;
    }

    const selectedGroupObj = partGroups.find(
      (group) => group.id.toString() === groupId.toString()
    );

    setSelectedPartGroup(groupId);
    setSelectedPartGroupName(selectedGroupObj ? selectedGroupObj.name : "");

    // Navigate to the selected part group to load its products
    navigate(`/shop/${groupId}`);
  };

  const handleCarModelChange = async (modelId) => {
    if (!modelId) {
      setSelectedModel("");
      setSelectedModelName("");
      setModelVariant([]);
      setCategories([]);
      setPartGroups([]);
      setSelectedVariant("");
      setSelectedVariantName("");
      setSelectedCategory("");
      setSelectedPartGroup("");
      setSelectedCategoryName("");
      setSelectedPartGroupName("");
      return;
    }

    const selectedModelObj = carModels.find(
      (model) => model.id.toString() === modelId.toString()
    );
    setSelectedModel(modelId);
    setSelectedModelName(selectedModelObj ? selectedModelObj.name : "");
    setSelectedVariant("");
    setSelectedVariantName("");
    setSelectedCategory("");
    setSelectedPartGroup("");
    setSelectedCategoryName("");
    setSelectedPartGroupName("");
    setModelVariant([]);
    setCategories([]);
    setPartGroups([]);
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}api/home/car_variant/${modelId}/`
      );
      setModelVariant(response.data);
    } catch (error) {
      console.error("Error fetching car variants:", error);
    }
  };

  const handleVariantChange = async (variantId) => {
    if (!variantId) {
      setSelectedVariant("");
      setSelectedVariantName("");
      setCategories([]);
      setPartGroups([]);
      setSelectedCategory("");
      setSelectedPartGroup("");
      setSelectedCategoryName("");
      setSelectedPartGroupName("");
      return;
    }

    const selectedVariantObj = modelVariant.find(
      (variant) => variant.id.toString() === variantId.toString()
    );
    setSelectedVariant(variantId);
    setSelectedVariantName(selectedVariantObj ? selectedVariantObj.name : "");
    setSelectedCategory("");
    setSelectedPartGroup("");
    setSelectedCategoryName("");
    setSelectedPartGroupName("");
    setPartGroups([]);
    
    await fetchCategoriesByVariant(variantId);
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategoryName(category.name);
    setSelectedPartGroupName("");

    if (expandedCategoryId === category.id) {
      setExpandedCategoryId(null);
      setExpandedPartGroupId(null);
      return;
    }

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
    setSelectedPartGroupName(groupName);

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
       <div className="row g-3 align-items-end bg-white p-3 rounded shadow-sm mb-4">

  {/* 1) Search by Car */}
  <div className="col-12 col-md">
    <label className="form-label fw-semibold">
      Search by Car
    </label>
    <select
      className="form-select"
      value={selectedBrand}
      onChange={(e) => {
        const selectedId = e.target.value;
        const selectedMake = carMakes.find(
          (make) => make.id.toString() === selectedId
        );
        handleCarMakeChange(selectedId, selectedMake ? selectedMake.name : "");
      }}
    >
      <option value="">Car Brand</option>
      {carMakes.map((make) => (
        <option key={make.id} value={make.id}>
          {make.name}
        </option>
      ))}
    </select>
  </div>

  {/* 2) Search by Model */}
  <div className="col-12 col-md">
    <label className="form-label fw-semibold">
      Search by Model
    </label>
    <select
      className="form-select"
      value={selectedModel}
      onChange={(e) => handleCarModelChange(e.target.value)}
      disabled={!selectedBrand}
    >
      <option value="">Model</option>
      {carModels.map((model) => (
        <option key={model.id} value={model.id}>
          {model.name}
        </option>
      ))}
    </select>
  </div>

  {/* 3) Search by Variant */}
  <div className="col-12 col-md">
    <label className="form-label fw-semibold">
      Search by Variant
    </label>
    <select
      className="form-select"
      value={selectedVariant}
      onChange={(e) => handleVariantChange(e.target.value)}
      disabled={!selectedModel}
    >
      <option value="">Variant</option>
      {modelVariant.map((variant) => (
        <option key={variant.id} value={variant.id}>
          {variant.name}
        </option>
      ))}
    </select>
  </div>

  {/* 4) Search by Part Category */}
  <div className="col-12 col-md">
    <label className="form-label fw-semibold">
      Search by Part Category
    </label>
    <select
      className="form-select"
      value={selectedCategory}
      onChange={(e) => handleCategoryChange(e.target.value)}
      disabled={!selectedVariant}
    >
      <option value="">Part Section</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  </div>

  {/* 5) Search by Part Group */}
  <div className="col-12 col-md">
    <label className="form-label fw-semibold">
      Search by Part Group
    </label>
    <select
      className="form-select"
      value={selectedPartGroup}
      onChange={(e) => handlePartGroupChange(e.target.value)}
      disabled={!selectedCategory}
    >
      <option value="">Part Group</option>
      {partGroups.map((group) => (
        <option key={group.id} value={group.id}>
          {group.name}
        </option>
      ))}
    </select>
  </div>

</div>


        <div className="row flex-row-reverse--">
          <div className="col-xl-12 col-lg-12 order-lg-1 order-2 mb-5">
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
                  <div className="row">
                    <div className="mb-3 d-flex justify-content-between align-items-center col-xl-12">
                      <p className="text-muted mb-0">
                        Showing <strong>{indexOfFirstProduct + 1}</strong> to <strong>{Math.min(indexOfLastProduct, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> products
                      </p>
                      <div className="d-flex gap-2 align-items-center">
                        <label className="mb-0 me-2">Items per page:</label>
                        <select 
                          value={productsPerPage}
                          onChange={handleProductsPerPageChange}
                          className="form-select form-select-sm"
                          style={{ width: "80px" }}
                        >
                          <option value={9}>9</option>
                          <option value={12}>12</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                    </div>
                    {partGroupDetails && (
                      <div className="mb-4 col-xl-4">
                        <div className="card-body">
                          <div className="row align-items-center">
                            <div className="col-md-12">
                              {partGroupDetails.image ? (
                                <img 
                                  src={partGroupDetails.image} 
                                  alt={partGroupDetails.name}
                                  className="img-fluid rounded shadow-sm"
                                  style={{ maxHeight: "500px", objectFit: "cover", width: "100%" }}
                                />
                              ) : (
                                <div 
                                  className="bg-light rounded d-flex align-items-center justify-content-center"
                                  style={{ height: "200px" }}
                                >
                                  <i className="fas fa-image fa-3x text-muted"></i>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    

                    <div className="col-xl-8 table-responsive  rounded">
                      <table className="shadow-shop table table-striped table-hover align-middle mb-0 bg-white">
                        <thead className="table-light">
                          <tr>
                            <th scope="col" style={{ width: "5%" }} className="text-center">SKU</th>
                            <th scope="col" style={{ width: "12%" }}>Part No</th>
                            <th scope="col" style={{ width: "35%" }}>Part Name</th>
                            <th scope="col" style={{ width: "12%" }}>Stock</th>
                            <th scope="col" style={{ width: "15%" }}>Price</th>
                            <th scope="col" style={{ width: "15%" }} className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentProducts.map((product) => (
                            <tr key={product.id}>
                              <td className="text-center fw-semibold text-muted">
                                {product.sku || "N/A"}
                              </td>
                              <td>
                                <span className="text-muted">
                                  {product.part_no || product.product_code || "N/A"}
                                </span>
                              </td>
                              <td>
                                <Link 
                                  to={`/shop-details/${product.id}`}
                                  className="text-decoration-none text-dark fw-medium d-flex align-items-center"
                                >
                                  <span>{product.product_name || "Unnamed Product"}</span>
                                </Link>
                              </td>
                              <td>
                                <span 
                                  className={`badge-shop ${
                                    product.stock_count > 10 
                                      ? "bg-success" 
                                      : product.stock_count > 0 
                                      ? "bg-warning text-dark" 
                                      : "bg-danger"
                                  }`}
                                >
                                  {product.stock_count > 0 ? `${product.stock_count} Available` : "Out of Stock"}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex flex-column">
                                  <span className="text-muted text-decoration-line-through small">
                                    ₹{product.price || "0"}
                                  </span>
                                  <span className="fw-bold text-theme fs-6">
                                    ₹{product.sale_price || product.price || "0"}
                                  </span>
                                </div>
                              </td>
                              <td className="text-center">
                                <button
                                  className="btn btn-primary btn-sm px-3"
                                  onClick={() => handleAddToCart(product.id)}
                                  disabled={product.stock_count === 0}
                                  title={product.stock_count === 0 ? "Out of stock" : "Add to cart"}
                                >
                                  <i className="fas fa-shopping-cart me-1" />
                                 
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
</div>
                    {totalPages > 1 && (
                      <nav className="mt-4 d-flex justify-content-center" aria-label="Page navigation">
                        <ul className="pagination">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => handlePageChange(1)}
                              disabled={currentPage === 1}
                            >
                              First
                            </button>
                          </li>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <li 
                              key={page} 
                              className={`page-item ${currentPage === page ? 'active' : ''}`}
                            >
                              <button 
                                className="page-link" 
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            </li>
                          ))}
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => handlePageChange(totalPages)}
                              disabled={currentPage === totalPages}
                            >
                              Last
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </>
                ) : (
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

         {/*  */}
        </div>
      </div>
    </section>
  );
};

export default ShopArea;