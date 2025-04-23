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
                debugger;
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
                <h4 className="text-center fw-extrabold mb-20">filter By selecte Model Part</h4>
                <div className="row mt-5 brands-sec">
                {variantCategory.map((variant) => (
                    <div className="col-sm-12 col-md-2 col-lg-2 mb-3">
                        <div className="brand-models">
                            <Link to={`/part-group/${variant.id}`}><img
                               src={`${API_BASE_URL}${variant.image}`}
                                alt="varient image"
                            /></Link>
                            <div className="text-center">
                                <Link to={`/part-group/${variant.id}`} className="text-center brand-name">
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
