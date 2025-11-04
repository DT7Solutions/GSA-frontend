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
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
const [filteredProducts, setFilteredProducts] = useState([]);

  
  
  

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




  const token = localStorage.getItem("accessToken");

 const handleRangeChange = (value) => {
  setRange(value);

  // Filter based on price range
  const [min, max] = value;
  const filtered = productData.filter(
    (item) => item.price >= min && item.price <= max
  );

  setFilteredProducts(filtered);
  setCurrentPage(1); // Reset to first page after filtering
};


  // Fetch product data based on id
useEffect(() => {
  const fetchProductData = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await axios.get(`${API_BASE_URL}api/home/car_part_items/${id}/`);
      setProductData(response.data);
      setFilteredProducts(response.data); // 👈 initialize filter list here
    } catch (error) {
      console.error("Error fetching car parts:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  if (id) {
    fetchProductData();
  }
}, [id]);




  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // const currentProducts = productData.slice(
  //   indexOfFirstProduct,
  //   indexOfLastProduct
  // );
  const currentProducts = filteredProducts.slice(
  indexOfFirstProduct,
  indexOfLastProduct
);

const maxPrice = productData.length > 0 ? Math.max(...productData.map(p => p.price)) : 1000;

const totalPages = Math.ceil(filteredProducts.length / productsPerPage);


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
  // const fetchCategoriesByVariant = async (variantId) => {
  //   if (!variantId) return;
  //   try {
  //     const response = await axios.get(
  //       `${API_BASE_URL}api/home/car_variant_category_group/${variantId}/`
  //     );
  //     setCategories(response.data);

     
  //     const selectedBrandLS =
  //       JSON.parse(localStorage.getItem("selected_brand")) || {};
  //     selectedBrandLS.model_variant = variantId;
  //     localStorage.setItem("selected_brand", JSON.stringify(selectedBrandLS));
  //   } catch (error) {
  //     console.error("Error fetching part sections:", error);
  //   }
  // };
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


  // Handle Variant change
const handleVariantChange = (variantId) => {
  const selectedVariantObj = modelVariant.find(
    (variant) => variant.id.toString() === variantId.toString()
  );
  setSelectedVariant(variantId);
  setSelectedVariantName(selectedVariantObj ? selectedVariantObj.name : "");
  fetchCategoriesByVariant(variantId);
};


  // Handle Category click
const handleCategoryClick = async (categoryId) => {
  if (expandedCategoryId === categoryId) {
    // Collapse if already open
    setExpandedCategoryId(null);
    return;
  }

  setExpandedCategoryId(categoryId);

  // Skip fetch if already loaded
  if (partGroupsByCategory[categoryId]) return;

  try {
    const response = await axios.get(`${API_BASE_URL}api/home/part_groups_list/${categoryId}/`);
    setPartGroupsByCategory((prev) => ({
      ...prev,
      [categoryId]: response.data,
    }));
  } catch (error) {
    console.error("Error fetching part groups:", error);
  }
};
const handlePartGroupClick = async (groupId) => {
  if (expandedPartGroupId === groupId) {
    setExpandedPartGroupId(null); // Collapse
    return;
  }

  setExpandedPartGroupId(groupId);

  // Skip fetch if already loaded
  if (partItemsByGroup[groupId]) return;

  try {
    const response = await axios.get(`${API_BASE_URL}api/home/car_part_items/${groupId}/`);
    setPartItemsByGroup((prev) => ({
      ...prev,
      [groupId]: response.data,
    }));
  } catch (error) {
    console.error("Error fetching part items:", error);
  }
};





  return (
    <section className="space-top space-extra-bottom shop-sec">
      <div className="container">
        <div className="row flex-row-reverse">
        <div className="col-xl-9 col-lg-8">
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
      <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : (
    <>
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
                    <del>₹{product.sale_price}</del> ₹{product.price} &nbsp;
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

   
 {totalPages > 1 && (
  <div className="pagination mt-5 d-flex justify-content-center">
    <ul className="pagination-list d-flex align-items-center gap-2">

      {/* Previous Arrow */}
      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button
          className="page-link"
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        >
          &laquo;
        </button>
      </li>

      {(() => {
        const maxVisible = 5; // how many pages to show around current page
        let startPage = Math.max(2, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxVisible / 2));

        // Adjust if at the beginning
        if (currentPage <= Math.floor(maxVisible / 2)) {
          startPage = 2;
          endPage = Math.min(totalPages - 1, maxVisible + 1);
        }

        // Adjust if at the end
        if (currentPage + Math.floor(maxVisible / 2) >= totalPages) {
          startPage = Math.max(2, totalPages - maxVisible);
          endPage = totalPages - 1;
        }

        const pages = [];

        // First page
        pages.push(
          <li
            key={1}
            className={`page-item ${currentPage === 1 ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => handlePageChange(1)}>
              1
            </button>
          </li>
        );

        // Ellipsis before startPage
        if (startPage > 2) {
          pages.push(
            <li key="start-ellipsis" className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          );
        }

        // Middle pages
        for (let i = startPage; i <= endPage; i++) {
          pages.push(
            <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(i)}>
                {i}
              </button>
            </li>
          );
        }

        // Ellipsis after endPage
        if (endPage < totalPages - 1) {
          pages.push(
            <li key="end-ellipsis" className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          );
        }

        // Last page
        if (totalPages > 1) {
          pages.push(
            <li
              key={totalPages}
              className={`page-item ${currentPage === totalPages ? "active" : ""}`}
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

      {/* Next Arrow */}
      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
        <button
          className="page-link"
          onClick={() =>
            currentPage < totalPages && handlePageChange(currentPage + 1)
          }
        >
          &raquo;
        </button>
      </li>
    </ul>
  </div>
)}


    </>
  )}
</div>


          <div className="col-xl-3 col-lg-4 sidebar-widget-area">
            <aside className="sidebar-sticky-area sidebar-area sidebar-shop">
              <div>
                <h3 className="widget_title">Search by Car Brand</h3>

                <select
                  className="mb-3"
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
                  className="mb-3"
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
                  className="mb-3"
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

<div className="widget widget_categories mt-5 bg-white  rounded shadow-sm border p-0">
  <h3 className="widget_title mb-3  border-bottom fw-bold text-dar p-3 bg-theme-sidebar">Product Categories</h3>
  <ul className="category-list list-unstyled mb-0 p-3">
    {categories.length > 0 ? (
      categories.map((category) => (
        <li key={category.id} className="mb-3">
          <div
            className="category-card d-flex justify-content-between align-items-center p-3 rounded border hover-shadow"
            onClick={() => handleCategoryClick(category.id)}
            style={{ cursor: "pointer" }}
          >
            <span className="fw-semibold text-dark">
              {category.name}{" "}
              <span className="text-muted">({category.part_groups_count})</span>
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
                      onClick={() => handlePartGroupClick(group.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <Link
                        to={`/shop/${group.id}`}
                        className="text-decoration-none text-secondary fw-medium p-3 mb-0"
                      >
                        {group.name}
                      </Link>
                      <span className="toggle-square p-3">
                        {expandedPartGroupId === group.id ? "⊟" : "⊞"}
                      </span>
                    </div>

                    {expandedPartGroupId === group.id &&
                      partItemsByGroup[group.id] &&
                      partItemsByGroup[group.id].length > 0 && (
                        <ul className="part-item-list list-unstyled ps-4 mt-2">
                          {partItemsByGroup[group.id].map((item) => (
                            <li key={item.id} className="py-1">
                              <Link
                                to={`/shop-details/${item.id}`}
                                className="text-decoration-none text-muted hover-text-dark"
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
                   Price: <span className="from">₹{range[0]}</span> — <span className="to">₹{range[1]}</span>

                    <button
  type="button"
  className="button btn p-0"
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
