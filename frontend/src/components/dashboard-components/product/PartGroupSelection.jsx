


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../../config";

const PartGroupList = ({id, Modelveriant}) => {
const [carMakes, setCarMakes] = useState([]);
const [carModels, setCarModels] = useState([]);
const [modelVariants, setModelVariants] = useState([]);

const [allParts, setAllParts] = useState([]);
const [filteredParts, setFilteredParts] = useState([]);
const [categories, setCategories] = useState([]);

const [selectedBrand, setSelectedBrand] = useState("");
const [selectedModel, setSelectedModel] = useState("");
const [selectedVariant, setSelectedVariant] = useState("");
const [selectedCategory, setSelectedCategory] = useState("");

const [searchKeyword, setSearchKeyword] = useState("");

const [partList, setpartList] = useState([]);

    useEffect(() => {
            const fetchpratgroups_cat = async () => {
              try {
                const response = await axios.get(`${API_BASE_URL}api/home/part_groups_list/${id}/`);
                debugger;
                setpartList(response.data);
                console.log('got car-models payload:', response.data);
              } catch (error) {
                console.error('Error fetching car makes:', error);
              }
            };
            fetchpratgroups_cat();
          }, []);



  // Fetch all part groups initially
  useEffect(() => {
    const fetchAllPartGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/home/all_part_groups/`);
        setAllParts(response.data);
      } catch (err) {
        console.error("Error fetching all part groups", err);
      }
    };
    fetchAllPartGroups();
  }, []);

  // Fetch car makes
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/home/car-makes/`);
        setCarMakes(response.data);
      } catch (err) {
        console.error("Error fetching car makes", err);
      }
    };
    fetchMakes();
  }, []);

  // When brand changes, fetch models
  useEffect(() => {
    if (!selectedBrand) return;
    const fetchModels = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/home/car-models/${selectedBrand}/`);
        setCarModels(response.data);
        setSelectedModel("");
        setSelectedVariant("");
        setModelVariants([]);
        setFilteredParts([]);
        setCategories([]);
      } catch (err) {
        console.error("Error fetching car models", err);
      }
    };
    fetchModels();
  }, [selectedBrand]);

  // When model changes, fetch variants
  useEffect(() => {
    if (!selectedModel) return;
    const fetchVariants = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/home/car_variant/${selectedModel}/`);
        setModelVariants(response.data);
        setSelectedVariant("");
        setFilteredParts([]);
        setCategories([]);
      } catch (err) {
        console.error("Error fetching car variants", err);
      }
    };
    fetchVariants();
  }, [selectedModel]);

  useEffect(() => {
  if (!selectedVariant) return;

  const fetchData = async () => {
    try {
      // Fetch both APIs in parallel
      const [partsRes, categoryRes] = await Promise.all([
        axios.get(`${API_BASE_URL}api/home/part_groups_list/${selectedVariant}/`),
        axios.get(`${API_BASE_URL}api/home/car_variant_category/${selectedVariant}/`),
      ]);

      const parts = partsRes.data;
      const cats = categoryRes.data;

      // 🔧 Count parts per category
      const categoryCounts = parts.reduce((acc, part) => {
        if (part.category_id) {
          acc[part.category_id] = (acc[part.category_id] || 0) + 1;
        }
        return acc;
      }, {});

      // 🔗 Merge counts into categories
      const mergedCategories = cats.map((cat) => ({
        ...cat,
        part_count: categoryCounts[cat.id] || 0,
      }));

      setFilteredParts(parts);
      setCategories(mergedCategories);
    } catch (err) {
      console.error("Error fetching variant data", err);
    }
  };

  fetchData();
}, [selectedVariant]);


  // Combine filters
  const partsToDisplay = React.useMemo(() => {
    let parts = selectedVariant ? filteredParts : allParts;

    if (selectedCategory) {
      parts = parts.filter(
        (p) => p.category_id === parseInt(selectedCategory)
      );
    }

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      parts = parts.filter((p) => p.name.toLowerCase().includes(keyword));
    }

    return parts;
  }, [allParts, filteredParts, selectedVariant, selectedCategory, searchKeyword]);

  return (
    <section className="space-top space-extra-bottom shop-sec">
      <div className="container">
        <div className="row flex-row-reverse">
          {/* Part Group Cards */}
          <div className="col-xl-9 col-lg-8">
           

            <div className="row gy-4">
              {partList.length > 0 ? (
                partList.map((item) => (
                  <div className="col-xl-3 col-md-4 col-6" key={item.id}>
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
                ))
              ) : (
                <p className="text-center">No parts found.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-xl-3 col-lg-4 sidebar-widget-area">
            <aside className="sidebar-area sidebar-shop">
              <h4 className="widget_title">Filter by Car</h4>

              <div className="mb-3">
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

             {categories.length > 0 && (
  <div className="widget widget_categories mt-4">
    <h5 className="widget_title">Part Categories</h5>
    <ul className="category-list">
      {categories.map((cat) => (
        <li key={cat.id}>
          <Link
            to="#"
            onClick={() => setSelectedCategory(String(cat.id))}
            className={selectedCategory === String(cat.id) ? "active-category" : ""}
          >
            {cat.name} ({cat.part_count})
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

