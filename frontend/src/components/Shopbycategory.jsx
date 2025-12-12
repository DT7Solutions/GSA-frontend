import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs, EffectFade, Autoplay } from "swiper";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

const Shopbycategory = ({ id = 4 }) => {
  const [variantCategory, setvariantCategory] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Dropdown states
  const [carBrands, setCarBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carVariants, setCarVariants] = useState([]);
  
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarModel = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/home/car_variant_category/${id}/`);
        setvariantCategory(response.data);
        console.log('got car-models payload:', response.data);
      } catch (error) {
        console.error('Error fetching car makes:', error);
      }
    };

    fetchCarModel();
  }, [id]);

  // Fetch car brands when popup opens
  useEffect(() => {
    if (showPopup) {
      fetchCarBrands();
    }
  }, [showPopup]);

  const fetchCarBrands = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}api/home/car-makes/`);
      setCarBrands(response.data);
    } catch (error) {
      console.error('Error fetching car brands:', error);
    }
  };

  const fetchCarModels = async (brandId) => {
    setLoadingModels(true);
    try {
      const response = await axios.get(`${API_BASE_URL}api/home/car-models/${brandId}/`);
      setCarModels(response.data);
      setCarVariants([]);
      setSelectedModel("");
      setSelectedVariant("");
    } catch (error) {
      console.error('Error fetching car models:', error);
      setCarModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const fetchCarVariants = async (modelId) => {
    setLoadingVariants(true);
    try {
      const response = await axios.get(`${API_BASE_URL}api/home/car_variant/${modelId}/`);
      setCarVariants(response.data);
      setSelectedVariant("");
    } catch (error) {
      console.error('Error fetching car variants:', error);
      setCarVariants([]);
    } finally {
      setLoadingVariants(false);
    }
  };

  const handleCategoryClick = (variant) => {
    setSelectedCategory(variant);
    setShowPopup(true);
  };

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    
    if (brandId) {
      fetchCarModels(brandId);
    } else {
      setCarModels([]);
      setCarVariants([]);
      setSelectedModel("");
      setSelectedVariant("");
    }
  };

  const handleModelChange = (e) => {
    const modelId = e.target.value;
    setSelectedModel(modelId);
    
    if (modelId) {
      fetchCarVariants(modelId);
    } else {
      setCarVariants([]);
      setSelectedVariant("");
    }
  };

  const handleVariantChange = (e) => {
    setSelectedVariant(e.target.value);
  };

  const handleSubmit = () => {
    const brandData = carBrands.find(b => b.id == selectedBrand);
    const modelData = carModels.find(m => m.id == selectedModel);
    const variantData = carVariants.find(v => v.id == selectedVariant);

    const selectionData = {
      brand_category: selectedCategory.id,
      brand_category_name: selectedCategory.name,
      car_brand_id: selectedBrand,
      car_brand_name: brandData?.name || "",
      car_model_id: selectedModel,
      car_model_name: modelData?.name || "",
      car_variant_id: selectedVariant || "",
      car_variant_name: variantData?.name || ""
    };

    localStorage.setItem("selected_brand", JSON.stringify(selectionData));
    setShowPopup(false);
    navigate(`/part-group/${selectedCategory.id}`);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedVariant("");
    setCarModels([]);
    setCarVariants([]);
  };

  return (
    <>
      <div className="client-area-3" style={{ backgroundColor: '#F0F2F5' }}>
        <div className="container">
          <div className="row gx-80">
            <div className="col-lg-12">
              <div className="client-slider3">
                <div className="title-area">
                  <h4 className="sec-title text-dark text-center">Shop by <span className="highlight-text">Category</span></h4>
                </div>
                
                <Swiper
                  spaceBetween={20}
                  slidesPerGroup={1}
                  speed={1000}
                  loop={variantCategory.length > 5}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  className="mySwiper"
                  modules={[FreeMode, Thumbs, EffectFade, Autoplay]}
                  breakpoints={{
                    0: {
                      slidesPerView: 2,
                    },
                    768: {
                      slidesPerView: 3,
                    },
                    992: {
                      slidesPerView: 4,
                    },
                    1200: {
                      slidesPerView: 6,
                    },
                    1400: {
                      slidesPerView: 6,
                    },
                  }}
                >
                  {variantCategory.map((variant) => (
                    <SwiperSlide key={variant.id}>
                      <div className="brandslider">
                        <div className="category-card-item shop-by-category">
                          <a 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCategoryClick(variant);
                            }}
                          >
                            <img
                              src={variant.image}
                              alt={variant.name} 
                              style={{background:"#f6f6f6"}}
                            />
                          </a>
                          <div className="text-center mt-3">
                            <a 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleCategoryClick(variant);
                              }}
                              className="brand-name"
                            >
                              <h6 className="mb-0 category-f-size">{variant.name}</h6>
                            </a>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Popup Modal */}
      {showPopup && (
        <div className="modern-modal-overlay" onClick={closePopup}>
          <div className="modern-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modern-modal-header">
              <div>
                <h5 className="modern-modal-title">Select Your Vehicle</h5>
                <p className="modern-modal-subtitle">Choose your car details to find the perfect parts</p>
              </div>
              <button className="modern-close-btn" onClick={closePopup}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="modern-modal-body">
              {/* Category Badge */}
              <div className="category-badge">
                <span className="badge-label">Category</span>
                <span className="badge-value">{selectedCategory?.name}</span>
              </div>
              
              {/* Form Fields */}
              <div className="modern-form-group">
                <label className="modern-label">
                  Car Brand <span className="required-star">*</span>
                </label>
                <div className="select-wrapper">
                  <select 
                    className="modern-select"
                    value={selectedBrand}
                    onChange={handleBrandChange}
                  >
                    <option value="">Select your car brand</option>
                    {carBrands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  <svg className="select-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="modern-form-group">
                <label className="modern-label">
                  Car Model <span className="required-star">*</span>
                </label>
                <div className="select-wrapper">
                  <select 
                    className="modern-select"
                    value={selectedModel}
                    onChange={handleModelChange}
                    disabled={!selectedBrand || loadingModels}
                  >
                    <option value="">
                      {loadingModels ? "Loading models..." : "Select your car model"}
                    </option>
                    {carModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  <svg className="select-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="modern-form-group">
                <label className="modern-label">
                  Car Variant <span className="optional-text">(Optional)</span>
                </label>
                <div className="select-wrapper">
                  <select 
                    className="modern-select"
                    value={selectedVariant}
                    onChange={handleVariantChange}
                    disabled={!selectedModel || loadingVariants}
                  >
                    <option value="">
                      {loadingVariants ? "Loading variants..." : 
                       carVariants.length === 0 && selectedModel ? "No variants available" : 
                       "Select your car variant"}
                    </option>
                    {carVariants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name}
                      </option>
                    ))}
                  </select>
                  <svg className="select-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modern-modal-footer">
              <button className="modern-btn modern-btn-secondary" onClick={closePopup}>
                Cancel
              </button>
              <button 
                className="modern-btn modern-btn-primary" 
                onClick={handleSubmit}
                disabled={!selectedBrand || !selectedModel}
              >
                Continue Searching
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{marginLeft: '8px'}}>
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modern-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modern-modal-content {
          background: white;
          border-radius: 20px;
          width: 95%;
          max-width: 540px;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease-out;
          display: flex;
          flex-direction: column;
        }

        .modern-modal-header {
          padding: 32px 32px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .modern-modal-title {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.3;
        }

        .modern-modal-subtitle {
          margin: 6px 0 0;
          font-size: 14px;
          color: #6b7280;
          font-weight: 400;
        }

        .modern-close-btn {
          background: white;
          border: 1px solid #e5e7eb;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .modern-close-btn:hover {
          background: #f3f4f6;
          color: #1f2937;
          border-color: #d1d5db;
        }

        .modern-modal-body {
          padding: 32px;
          overflow-y: auto;
          flex: 1;
        }

        .category-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #0068a5 0%, #004d7a 100%);
          padding: 10px 20px;
          border-radius: 12px;
          margin-bottom: 28px;
        }

        .badge-label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-value {
          font-size: 15px;
          font-weight: 600;
          color: white;
        }

        .modern-form-group {
          margin-bottom: 24px;
        }

        .modern-label {
          display: block;
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.2px;
        }

        .required-star {
          color: #ef4444;
          margin-left: 2px;
        }

        .optional-text {
          color: #9ca3af;
          font-weight: 400;
          font-size: 13px;
        }

        .select-wrapper {
          position: relative;
        }

        .modern-select {
          width: 100%;
          padding: 2px 40px 14px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          color: #1f2937;
          background: white;
          appearance: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .modern-select:hover {
          border-color: #d1d5db;
        }

        .modern-select:focus {
          outline: none;
          border-color: #0068a5;
          box-shadow: 0 0 0 4px rgba(0, 104, 165, 0.1);
        }

        .modern-select:disabled {
          background: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
          border-color: #e5e7eb;
        }

        .select-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          pointer-events: none;
        }

        .modern-modal-footer {
          padding: 24px 32px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: #f9fafb;
        }

        .modern-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.3px;
        }

        .modern-btn-secondary {
          background: white;
          color: #4b5563;
          border: 2px solid #e5e7eb;
        }

        .modern-btn-secondary:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .modern-btn-primary {
          background: linear-gradient(135deg, #0068a5 0%, #004d7a 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 104, 165, 0.3);
        }

        .modern-btn-primary:hover {
          box-shadow: 0 6px 20px rgba(0, 104, 165, 0.4);
          transform: translateY(-1px);
        }

        .modern-btn-primary:disabled {
          background: #d1d5db;
          color: #9ca3af;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .modern-modal-content {
            width: 100%;
            max-width: 100%;
            border-radius: 20px 20px 0 0;
            max-height: 95vh;
            align-self: flex-end;
          }

          .modern-modal-header {
            padding: 24px 20px 20px;
          }

          .modern-modal-title {
            font-size: 20px;
          }

          .modern-modal-subtitle {
            font-size: 13px;
          }

          .modern-close-btn {
            width: 36px;
            height: 36px;
          }

          .modern-modal-body {
            padding: 24px 20px;
          }

          .modern-modal-footer {
            padding: 20px;
            flex-direction: column;
          }

          .modern-btn {
            width: 100%;
          }

          .category-badge {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
};

export default Shopbycategory;