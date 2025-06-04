import React, { useEffect, useState } from "react";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";


const CarCategoryList = () => {
    const [carCategory, setCarCategoryList] = useState([]);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchCarCategoryList = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}api/home/get_parts_category_list/`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setCarCategoryList(response.data); 
            debugger;
          } catch (error) {
            console.error('Error fetching car brands list:', error);
          }
        };
    
        fetchCarCategoryList();
      }, []);



    return (
        <div className="card basic-data-table">
            <div className="card-header">
                <h5 className="card-title mb-0">Car Part Category List</h5>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table bordered-table mb-0" id="dataTable" data-page-length={10}>
                        <thead>
                            <tr>
                                <th scope="col">
                                    <div className="form-check style-check d-flex align-items-center">
                                        <label className="form-check-label">S.L</label>
                                    </div>
                                </th>
                                <th scope="col">Varient  Name</th>
                                <th scope="col">Category Name</th>                            
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carCategory.map((item, index) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="form-check style-check d-flex align-items-center">
                                            <label className="form-check-label">{index + 1}</label>
                                        </div>
                                    </td>
                                    <td>{item.variant_name}</td>
                                    <td>{item.name}</td>
                                    <td>
                                        <Link
                                            to={`/update-products/${item.id}`}
                                            className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                            title="Edit"
                                        >
                                            <Icon icon="lucide:edit" />
                                        </Link>
                                    </td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CarCategoryList;