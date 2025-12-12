import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs, EffectFade, Autoplay } from "swiper";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

const CategoryAreaOne = () => {
  const [carMakes, setCarMakes] = useState([]);

  useEffect(() => {
    const fetchCarMakes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/home/car-makes/`);
        setCarMakes(response.data);
      } catch (error) {
        console.error('Error fetching car makes:', error);
      }
    };
   
    fetchCarMakes();
  }, []);

  // Fixed: Store consistent brand data
  const handleBrandClick = (make) => {
    localStorage.setItem("selected_brand", JSON.stringify({ 
      brand: make.id,           // Use 'brand' instead of 'brand_id'
      brand_name: make.name 
    }));
  };

  return (
    <div className="category-area-1 pb-100 brand-logo-display" style={{ backgroundColor: '#F0F2F5' }}>
      <div className="container">
        <h4 className="text-center fw-extrabold mb-20  pt-5">Search By <span className='highlight-text'>Brand</span></h4>

        <div className="row mt-5 brands-sec">

        {carMakes.map((make) => (
        <div key={make.id} className="col-sm-12 col-md-3 col-lg-3 mb-3">
          <div className="category-card-item brand-design aligen-items-center">
              <Link
                to={`/brand-models/${make.id}`}
                onClick={() => handleBrandClick(make)}
              >
                <img
                  src={make.image}
                  alt={make.name}
                  onError={(e) => { e.target.src = `${process.env.PUBLIC_URL}/assets/img/brands/default.png`; }}
                />
              </Link>
            <div className="text-center">
                <Link 
                  to={`/brand-models/${make.id}`} 
                  onClick={() => handleBrandClick(make)} 
                  className="text-center brand-name car-brand-name"
                >
                  {make.name}
                </Link>
            </div>
          </div>
        </div>
      ))}
  
        </div>
      </div>
    </div>
  );
};

export default CategoryAreaOne;