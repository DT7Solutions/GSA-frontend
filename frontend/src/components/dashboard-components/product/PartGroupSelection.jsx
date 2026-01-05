import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../../config";

const PartGroupList = ({ id }) => {
  const [carMakes, setCarMakes] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [modelVariants, setModelVariants] = useState([]);
  const [partList, setPartList] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // ✅ Fetch part section full details and auto-populate filters (only on mount)
  useEffect(() => {
    const fetchPartSectionDetails = async () => {
      try {
        console.log("Fetching part section details for ID:", id);
        const response = await axios.get(`${API_BASE_URL}api/home/part-section/${id}/full-details/`);
        const data = response.data;
        
        console.log("Part Section Full Details:", data);

        // Auto-populate the filters
        if (data.car_make) {
          setSelectedBrand(data.car_make.id);
          console.log("Auto-selected Brand:", data.car_make.name);
        }
        
        if (data.car_model) {
          setSelectedModel(data.car_model.id);
          console.log("Auto-selected Model:", data.car_model.name);
        }
        
        if (data.car_variant) {
          setSelectedVariant(data.car_variant.id);
          console.log("Auto-selected Variant:", data.car_variant.name);
        }
        
        if (data.id && data.name) {
          setSelectedCategory(String(data.id));
          console.log("✅ Category auto-filled:", data.name, "ID:", data.id);
        }

      } catch (error) {
        console.error("Error fetching part section details:", error);
      }
    };

    if (id) {
      fetchPartSectionDetails();
    }
  }, [id]);

  // ✅ Fetch parts based on selected CATEGORY
  useEffect(() => {
    if (!selectedCategory) {
      console.log("No category selected, clearing parts");
      setPartList([]);
      return;
    }
    
    const fetchCategoryParts = async () => {
      try {
        console.log("Fetching parts for category (part section) ID:", selectedCategory);
        const res = await axios.get(`${API_BASE_URL}api/home/part_groups_list/${selectedCategory}/`);
        const parts = Array.isArray(res.data) ? res.data : [];
        console.log("Parts fetched for category:", parts.length, parts);
        setPartList(parts);
      } catch (error) {
        console.error("Error fetching parts by category:", error);
        setPartList([]);
      }
    };
    
    fetchCategoryParts();
  }, [selectedCategory]);

  // ✅ Fetch categories based on variant selection
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (selectedVariant) {
          // Fetch categories for selected variant
          console.log("Fetching categories for variant:", selectedVariant);
          const catRes = await axios.get(`${API_BASE_URL}api/home/car_part_count_part_group_count/${selectedVariant}/`);
          setCategories(catRes.data || []);
          
          // Only reset category if manually changed (not on initial load)
          // Don't reset if category was just auto-populated
        } else if (id && !selectedBrand && !selectedModel && !selectedVariant) {
          // Only fetch initial categories if no filters are selected
          console.log("Fetching initial categories for part section:", id);
          const res = await axios.get(`${API_BASE_URL}api/home/part_groups_list/${id}/`);
          const parts = res.data || [];
          
          // Build category counts from parts
          const categoryCounts = parts.reduce((acc, part) => {
            const catId = String(part.part_section?.id || "");
            const catName = part.part_section?.name;
            if (catId && catName) {
              if (!acc[catId]) acc[catId] = { id: catId, name: catName, part_groups_count: 0 };
              acc[catId].part_groups_count += 1;
            }
            return acc;
          }, {});
          
          setCategories(Object.values(categoryCounts));
        } else if (selectedBrand && selectedModel && !selectedVariant) {
          // Clear categories if brand and model are selected but no variant yet
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    
    fetchCategories();
  }, [id, selectedVariant, selectedBrand, selectedModel]);

  // ✅ Fetch car dropdown data
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}api/home/car-makes/`)
      .then((res) => setCarMakes(res.data))
      .catch((err) => console.error("Error fetching car makes", err));
  }, []);

  // ✅ Fetch car models when brand changes
  useEffect(() => {
    if (!selectedBrand) {
      setCarModels([]);
      setSelectedModel("");
      return;
    }
    
    axios
      .get(`${API_BASE_URL}api/home/car-models/${selectedBrand}/`)
      .then((res) => {
        setCarModels(res.data);
      })
      .catch((err) => console.error("Error fetching car models", err));
  }, [selectedBrand]);

  // ✅ Fetch car variants when model changes
  useEffect(() => {
    if (!selectedModel) {
      setModelVariants([]);
      setSelectedVariant("");
      return;
    }
    
    axios
      .get(`${API_BASE_URL}api/home/car_variant/${selectedModel}/`)
      .then((res) => {
        setModelVariants(res.data);
      })
      .catch((err) => console.error("Error fetching car variants", err));
  }, [selectedModel]);

  // ✅ Handle brand change - reset dependent filters
  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    setSelectedBrand(newBrand);
    setSelectedModel("");
    setSelectedVariant("");
    setSelectedCategory("");
    setCarModels([]);
    setModelVariants([]);
    setCategories([]);
    setPartList([]);
  };

  // ✅ Handle model change - reset dependent filters
  const handleModelChange = (e) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    setSelectedVariant("");
    setSelectedCategory("");
    setModelVariants([]);
    setCategories([]);
    setPartList([]);
  };

  // ✅ Handle variant change - reset category
  const handleVariantChange = (e) => {
    const newVariant = e.target.value;
    setSelectedVariant(newVariant);
    setSelectedCategory("");
    setPartList([]);
  };

  // ✅ Search filter
  const partsToDisplay = useMemo(() => {
    let parts = partList;
    
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      parts = parts.filter((p) => {
        const productName = p.product_name?.toLowerCase() || "";
        const name = p.name?.toLowerCase() || "";
        return productName.includes(keyword) || name.includes(keyword);
      });
    }
    
    return parts;
  }, [partList, searchKeyword]);

  // ✅ Pagination
  const totalPages = Math.ceil(partsToDisplay.length / itemsPerPage);
  const paginatedParts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return partsToDisplay.slice(startIndex, startIndex + itemsPerPage);
  }, [partsToDisplay, currentPage]);

  const selectedCategoryName =
    categories.find((cat) => String(cat.id) === selectedCategory)?.name || "";

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, selectedModel, selectedVariant, selectedCategory, searchKeyword]);

  return (
    <section className="space-top space-extra-bottom shop-sec">
      <div className="container">
        <div className="row flex-row-reverse">
          {/* MAIN CONTENT */}
          <div className="col-xl-9 col-lg-8 order-2  order-lg-1">
            {/* Search Bar */}
         

           {selectedCategory && (
              <div className="mb-4">
                <div className="row align-items-center mb-5">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <h5 className="mb-0">
                      {selectedCategoryName || "Selected Category"}
                    </h5>
                    <small className="text-muted">({partsToDisplay.length} parts)</small>
                  </div>
                  <div className="col-md-6">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control bg-grey border-smooth"
                        placeholder="Search part groups..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                      <button className="btn-theme-admin btn-primary-600" type="button">
                        <i className="fas fa-search"></i> Search
                      </button>
                      {searchKeyword && (
                        <button 
                          className="btn-theme-admin btn-primary-600" 
                          type="button"
                          onClick={() => setSearchKeyword("")}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="row gy-4">
              {selectedCategory ? (
                paginatedParts.length > 0 ? (
                  paginatedParts.map((item) => {
                  
                    const isChassis = selectedCategoryName?.toUpperCase() === "CHASSIS";
                    const colClass = isChassis ? "col-xl-4" : "col-xl-3";
                    
                    return (
                      <div className={`${colClass} col-md-3 col-6`} key={item.id}>
                        <div className="product-card style2">
                          <div className="product-img">
                            <Link to={`/shop/${item.id}`}>
                              <img
                                src={item.image || "/assets/img/placeholder.png"}
                                alt={item.name}
                              />
                            </Link>
                          </div>
                          <div className="product-content text-center">
                            <h6 className="product-title  shop-name-title">
                              <Link to={`/shop/${item.id}`}>{item.name}</Link>
                            </h6>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12">
                    <p className="text-center">No parts found for this section.</p>
                  </div>
                )
              ) : (
                <div className="col-12">
                  <p className="text-center">Please select a part section to view parts.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <li
                            key={pageNum}
                            className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          </li>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return (
                          <li key={pageNum} className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        );
                      }
                      return null;
                    })}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="col-xl-3 col-lg-4 order-1  order-lg-2 sidebar-widget-area">
            <aside className="sidebar-area sidebar-shop">
              <div className="bg-white border-smooth">
                <h4 className="widget_title bg-theme-sidebar p-3 mb-2">Filter by Car</h4>

                <div className="p-3">
                  {/* Brand */}
                  <div className="mb-3">
                    <label className="form-label">Car Brand</label>
                    <select
                      className="form-select"
                      value={selectedBrand}
                      onChange={handleBrandChange}
                    >
                      <option value="">-- Select Brand --</option>
                      {carMakes.map((make) => (
                        <option key={make.id} value={make.id}>
                          {make.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Model */}
                  <div className="mb-3">
                    <label className="form-label">Car Model</label>
                    <select
                      className="form-select"
                      value={selectedModel}
                      onChange={handleModelChange}
                      disabled={!selectedBrand}
                    >
                      <option value="">-- Select Model --</option>
                      {carModels.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Variant */}
                  <div className="mb-3">
                    <label className="form-label">Car Variant</label>
                    <select
                      className="form-select"
                      value={selectedVariant}
                      onChange={handleVariantChange}
                      disabled={!selectedModel}
                    >
                      <option value="">-- Select Variant --</option>
                      {modelVariants.map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Part Sections */}
              {categories.length > 0 && (
                <div className="widget bg-white widget_categories mt-5 p-0">
                  <h5 className="widget_title bg-theme-sidebar mb-2 p-3">Part Sections</h5>
                  <ul className="category-list p-3">
                    {categories.map((cat) => {
                      const catId = String(cat.id);
                      const isSelected = selectedCategory === catId;
                      
                      return (
                        <li key={cat.id}>
                          <Link
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              console.log("Category clicked:", catId, cat.name);
                              setSelectedCategory(catId);
                            }}
                            style={
                              isSelected
                                ? { backgroundColor: "#0068a5", color: "#fff", padding: "8px 12px", borderRadius: "4px", display: "block" }
                                : { padding: "8px 12px", display: "block" }
                            }
                          >
                            {cat.name} ({cat.part_groups_count ?? 0})
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartGroupList;