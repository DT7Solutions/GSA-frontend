import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../../config";

const BrandModels = ({ id ,carMakes}) => {
    const [carModel, setCarModels] = useState([]);

    useEffect(() => {
        const fetchCarModel = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-models/${id}/`);
            debugger;
            setCarModels(response.data);
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
                <h4 className="text-center fw-extrabold mb-20">Search By {carMakes.name} Car Model</h4>
                <div className="row mt-5 brands-sec">
                    {carModel.map((model) => (
                        <div className="col-sm-12 col-md-3 col-lg-3 mb-3">
                            <div className="brand-models">
                                <Link to={`/models-variant/${model.id}`} onClick={() => {
                                
                                    const existing = JSON.parse(localStorage.getItem("selected_brand")) || {};
                                    const updated = {
                                        ...existing,
                                        brand_model: model.id
                                    };
                                    localStorage.setItem("selected_brand", JSON.stringify(updated));
                                }}><img
                                        src={model.image}
                                        alt={carMakes.name}
                                    /></Link>
                                <div className="text-center">
                                    <Link to={`/models-variant/${model.id}`} className="text-center brand-name"
                                        onClick={() => {
                                            const existing = JSON.parse(localStorage.getItem("selected_brand")) || {};
                                            const updated = {
                                                ...existing,
                                                brand_model: model.id
                                            };
                                            localStorage.setItem("selected_brand", JSON.stringify(updated));
                                        }}
                                    >
                                        {model.name} {model.generation} <br />({model.production_start_date}-{model.production_end_date})
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

export default BrandModels;
