import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../../config";


const PartCategorySelection = ({id, modelvariant}) => {

    const [variantCategory, setvariantCategory] = useState([]);

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
          }, []);


    return (

        <div className="category-area-1 pb-100 brand-logo-display mt-5">
            <div className="container-fluid">
                <h5 className="text-center search-heading mb-0">
    <span className="heading-muted">Filter by</span>
    <span className="heading-brand"> Selected Model</span>
    <span className="heading-muted"> Part</span>
  </h5>
                
                <div className="row mt-5 brands-sec">
                {variantCategory.map((variant) => (
                    <div className="col-sm-12 col-md-2 col-lg-2 mb-3">
                        <div className="brand-models">
                            {/* to={`/part-group/${variant.id}`} */}
                            <Link to={`/part-group/${variant.id}`}
                                onClick={() => {
                                    const existing = JSON.parse(localStorage.getItem("selected_brand")) || {};
                                    const updated = {
                                        ...existing,
                                        brand_category: variant.id,
                                        brand_category_name: variant.name,
                                    };
                                    localStorage.setItem("selected_brand", JSON.stringify(updated));
                                }}
                            ><img
                                    src={variant.image}
                                    alt={variant.name}
                                /></Link>
                            <div className="text-center">
                                <Link to={`/part-group/${variant.id}`}
                                    onClick={() => {
                                        const existing = JSON.parse(localStorage.getItem("selected_brand")) || {};
                                        const updated = {
                                            ...existing,
                                            brand_category: variant.id
                                        };
                                        localStorage.setItem("selected_brand", JSON.stringify(updated));
                                    }}
                                    className="text-center brand-name">
                                    {variant.name}
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

export default PartCategorySelection;
