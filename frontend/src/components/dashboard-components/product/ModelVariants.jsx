import React, { useEffect, useState } from "react";
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../../../config";

const ModelVariantsList = ({id , carModelItem}) => {
    const [modelvariant, setModelvariant] = useState([]);

    useEffect(() => {
        const fetchCarModel = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}api/home/car_variant/${id}/`);
            debugger;
            setModelvariant(response.data);
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
                <h4 className="text-center fw-extrabold mb-20">Select Your {carModelItem.name} {carModelItem.generation} Variants</h4>
                <div className="row mt-5 brands-sec">

                    <div className="col-sm-12 col-md-4 col-lg-4 mb-3">
                        <div className="brand-models">
                        <img
                               src={carModelItem.image}
                                alt={carModelItem.name}
                            />
                            <div className="text-center">
                                {carModelItem.car_make} {carModelItem.name} {carModelItem.generation}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-12 mb-3">
                        <div className="brand-models">
                            <div className="card">
                                <div className="card-body">
                                    <table className="table bordered-table mb-0">
                                        <thead>
                                            <tr>

                                                <th scope="col">Name</th>
                                                <th scope="col">Region</th>
                                                <th scope="col">Production Year</th>
                                                <th scope="col">Engine</th>
                                                <th scope="col">Chassis Type</th>
                                                <th scope="col">Description</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                        {modelvariant.map((variant) => (
                                            <tr>
                                                <td>
                                                    <Link to={`/part-category/${variant.id}`}
                                                        onClick={() => {
                                                            const existing = JSON.parse(localStorage.getItem("selected_brand")) || {};
                                                            const updated = {
                                                                ...existing,
                                                                model_variant: variant.id
                                                            };
                                                            localStorage.setItem("selected_brand", JSON.stringify(updated));
                                                        }}
                                                        className="text-primary-600">
                                                        {variant.name} ({carModelItem.fuel_type})-{carModelItem.generation}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src="assets/images/user-list/user-list1.png"
                                                            alt=""
                                                            className="flex-shrink-0 me-12 radius-8"
                                                        />
                                                        <h6 className="text-md mb-0 fw-medium flex-grow-1">
                                                        {variant.region}
                                                        </h6>
                                                    </div>
                                                </td>
                                                <td>{variant.production_start_date} - {variant.production_end_date}</td>
                                             <td>
                                                  {variant.engine}
                                                    </td>
                                                <td>
                                                {variant.chassis_type}
                                                </td>
                                                <td>
                                                {variant.description}
                                                  
                                                </td>
                                            </tr>
                                        ))}
                                         

                                        </tbody>
                                    </table>
                         
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default ModelVariantsList;