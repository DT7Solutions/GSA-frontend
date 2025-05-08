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


  return (
    <div className="category-area-1 pb-100 brand-logo-display">
      <div className="container-fluid">
        <h4 className="text-center fw-extrabold mb-20  mt-5 pt-5">Search By Brand</h4>

        <div className="row mt-5 brands-sec">

        {carMakes.map((make) => (
        <div key={make.id} className="col-sm-12 col-md-3 col-lg-3 mb-3">
          <div className="category-card-item aligen-items-center">
            <Link to={`/brand-models/${make.id}`}>
              <img
                src={make.image} 
                alt={make.name}
                onError={(e) => { e.target.src = `${process.env.PUBLIC_URL}/assets/img/brands/default.png`; }}
              />
            </Link>
            <div className="text-center">
              <Link to={`/brand-models/${make.id}`} className="text-center brand-name car-brand-name">
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
