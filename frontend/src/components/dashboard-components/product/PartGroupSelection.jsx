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

  // ✅ Fetch default part groups
  useEffect(() => {
    const fetchDefaultPartGroups = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}api/home/part_groups_list/${id}/`);
        const parts = res.data || [];
        setPartList(parts);

        const categoryCounts = parts.reduce((acc, part) => {
          const catId = String(part.part_section?.id || "");
          const catName = part.part_section?.name;
          if (catId && catName) {
            if (!acc[catId]) acc[catId] = { id: catId, name: catName, count: 0 };
            acc[catId].count += 1;
          }
          return acc;
        }, {});
        setCategories(Object.values(categoryCounts));
      } catch (error) {
        console.error("Error fetching default part groups:", error);
      }
    };
    if (id) fetchDefaultPartGroups();
  }, [id]);

  // ✅ Fetch parts & categories for selected variant
  useEffect(() => {
    if (!selectedVariant) return;
    const fetchVariantParts = async () => {
      try {
        const [partsRes, catRes] = await Promise.all([
          axios.get(`${API_BASE_URL}api/home/part_groups_list/${selectedVariant}/`),
          // ✅ 🔁 REPLACED OLD ENDPOINT HERE:
          axios.get(`${API_BASE_URL}api/home/car_part_count_part_group_count/${selectedVariant}/`),
        ]);

        const parts = partsRes.data || [];
        setPartList(parts);

        // Build count per category from fetched parts
        const categoryCounts = parts.reduce((acc, part) => {
          const catId = String(part.part_section?.id || "");
          const catName = part.part_section?.name;
          if (catId && catName) {
            if (!acc[catId]) acc[catId] = { id: catId, name: catName, count: 0 };
            acc[catId].count += 1;
          }
          return acc;
        }, {});

        // ✅ Merge with new API data (which has part_groups_count)
        const mergedCats = (catRes.data || []).map((cat) => {
          const catId = String(cat.id);
          return {
            ...cat,
            count: categoryCounts[catId]?.count || 0,
            part_groups_count: cat.part_groups_count || 0,
          };
        });

        setCategories(mergedCats);
      } catch (err) {
        console.error("Error fetching variant data:", err);
      }
    };
    fetchVariantParts();
  }, [selectedVariant]);

  // ✅ Fetch parts by selected category
  useEffect(() => {
    if (!selectedCategory) return;
    const fetchCategoryParts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}api/home/part_groups_list/${selectedCategory}/`);
        setPartList(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching parts by category:", error);
        setPartList([]);
      }
    };
    fetchCategoryParts();
  }, [selectedCategory]);

  // ✅ Fetch car dropdown data
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}api/home/car-makes/`)
      .then((res) => setCarMakes(res.data))
      .catch((err) => console.error("Error fetching car makes", err));
  }, []);

  useEffect(() => {
    if (!selectedBrand) return;
    axios
      .get(`${API_BASE_URL}api/home/car-models/${selectedBrand}/`)
      .then((res) => {
        setCarModels(res.data);
        setSelectedModel("");
        setSelectedVariant("");
        setModelVariants([]);
      })
      .catch((err) => console.error("Error fetching car models", err));
  }, [selectedBrand]);

  useEffect(() => {
    if (!selectedModel) return;
    axios
      .get(`${API_BASE_URL}api/home/car_variant/${selectedModel}/`)
      .then((res) => {
        setModelVariants(res.data);
        setSelectedVariant("");
      })
      .catch((err) => console.error("Error fetching car variants", err));
  }, [selectedModel]);

  // ✅ Search filter
  const partsToDisplay = useMemo(() => {
    let parts = partList;
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      parts = parts.filter((p) => p.product_name?.toLowerCase().includes(keyword));
    }
    return parts;
  }, [partList, searchKeyword]);

  // ✅ Pagination
  const totalPages = Math.ceil(partsToDisplay.length / itemsPerPage);
  const paginatedParts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return partsToDisplay.slice(startIndex, startIndex + itemsPerPage);
  }, [partsToDisplay, currentPage]);

  // ✅ Dynamic counts for displayed parts
  const filteredCategoryCounts = useMemo(() => {
    const counts = {};
    partsToDisplay.forEach((p) => {
      const catId = String(p.part_section?.id || "");
      if (catId) counts[catId] = (counts[catId] || 0) + 1;
    });
    return counts;
  }, [partsToDisplay]);

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
          <div className="col-xl-9 col-lg-8">
            {/* <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">
                {selectedCategory
                  ? `${selectedCategoryName} (${partsToDisplay.length} Items)`
                  : `All Parts (${partsToDisplay.length} Items)`}
              </h4>
            </div> */}
<div className="row gy-4">
  {paginatedParts.length > 0 ? (
    paginatedParts.map((item) => {
      // Check if the selected category is CHASSIS
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
              <h6 className="product-title">
                <Link to={`/shop/${item.id}`}>{item.name}</Link>
              </h6>
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <p className="text-center">No parts found.</p>
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
                      // Show first, last, current, and adjacent pages
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
          <div className="col-xl-3 col-lg-4 sidebar-widget-area">
            <aside className="sidebar-area sidebar-shop">
              <div className="bg-white border-smooth">
              <h4 className="widget_title bg-theme-sidebar p-3 mb-2">Filter by Car</h4>

              {/* Brand */}
              <div className="p-3">
              <div className="mb-3 ">
                <label className="form-label">Car Brand</label>
                <select
                  className="form-select"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
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
                  onChange={(e) => setSelectedModel(e.target.value)}
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
                  onChange={(e) => setSelectedVariant(e.target.value)}
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
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          to="#"
                          onClick={() => setSelectedCategory(String(cat.id))}
                          style={
                            selectedCategory === String(cat.id)
                              ? { backgroundColor: "#0068a5", color: "#fff", padding: "8px 12px", borderRadius: "4px", display: "block" }
                              : { padding: "8px 12px", display: "block" }
                          }
                        >
                          {cat.name} ({cat.part_groups_count ?? 0})
                        </Link>
                      </li>
                    ))}
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