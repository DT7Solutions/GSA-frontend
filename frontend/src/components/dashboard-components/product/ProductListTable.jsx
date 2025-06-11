import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";

import { jwtDecode } from "jwt-decode";


const ProductListTable = () => {
const { id } = useParams();

const isTokenValid = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (error) {
        return false; 
    }
};

    const [partList, setpartList] = useState([]);

    useEffect(() => {
        const fetchCarModel = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/home/car_part_items/${id}/`);
              
                setpartList(response.data);
                console.log('got car-models payload:', response.data);
            } catch (error) {
                console.error('Error fetching car makes:', error);
            }
        };

        fetchCarModel();
    }, []);


    const handleAddToCart = async (partId) => {
        const token = localStorage.getItem('accessToken');

        if (!token || !isTokenValid(token)) {
            Swal.fire({
                title: "Your session has expired. Please login again",
                text: "",
                icon: "error",
                confirmButtonText: "OK",
            });
            localStorage.setItem("redirectAfterLogin", window.location.href);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            window.location.href = '#/login';
            return;
        }
       
        try {
            await axios.post(`${API_BASE_URL}api/home/cart/add/${partId}/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire({
                title: "Successfully added to cart",
                text: "Your product was added to the cart.",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                window.location.reload();
            });
            // window.location.reload();
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "There was an issue adding the product to the cart.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <table className="table bordered-table mb-0">
                    <thead>
                        <tr>
                            {/* <th scope="col">
                                <div className="form-check style-check d-flex align-items-center">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        defaultValue=""
                                        id="checkAll"
                                    />
                                    <label className="form-check-label" htmlFor="checkAll">
                                        S.L
                                    </label>
                                </div>
                            </th> */}
                            <th scope="col">Fig No.</th>
                            <th scope="col">Part No.</th>
                            <th scope="col">Description.</th>
                            <th scope="col">Qty</th>
                            <th scope="col">Remarks</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {partList.map((item)  =>(
                        <tr>
                                {/*<td>
                             <div className="form-check style-check d-flex align-items-center">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        defaultValue=""
                                        id="check1"
                                    />
                                    <label className="form-check-label" htmlFor="check1">
                                        01
                                    </label>
                                </div> 
                            </td>*/}
                            <td>
                                <Link to="#" className="text-primary-600">
                                   {item.fig_no}
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
                                    {item.part_no}
                                    </h6>
                                </div>
                            </td>
                            <td>{item.description}</td>
                            <td>{" "}
                                <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                                {item.stock_count}
                                </span></td>
                            <td>
                              {item.remarks}
                            </td>
                            <td>
                                {/* <Link
                                    to="#"
                                    className="w-32-px h-32-px  me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                                >
                                    <Icon icon="iconamoon:eye-light" />
                                </Link> */}
                                <button
                                        onClick={() => handleAddToCart(item.id)}
                                        className="btn btn-success"
                                    >
                                        <Icon icon="lucide:shopping-cart" /> Add to Cart
                                    </button>
                                {/* <Link
                                    to="#"
                                    className="w-32-px h-32-px  me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                >
                                    <Icon icon="mingcute:delete-2-line" />
                                </Link> */}
                            </td>
                        </tr>
                    ))}
                        
                        
                      
                       
                    </tbody>
                </table>
                {/* <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
                    <span>Showing 1 to 10 of 12 entries</span>
                    <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                        <li className="page-item">
                            <Link
                                className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px bg-base"
                                to="#"
                            >
                                <Icon icon="ep:d-arrow-left" className="text-xl" />
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-primary-600 text-white fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px"
                                to="#"
                            >
                                1
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-primary-50 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px"
                                to="#"
                            >
                                2
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link bg-primary-50 text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px"
                                to="#"
                            >
                                3
                            </Link>
                        </li>
                        <li className="page-item">
                            <Link
                                className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px  me-8 w-32-px bg-base"
                                to="#"
                            >
                                {" "}
                                <Icon icon="ep:d-arrow-right" className="text-xl" />{" "}
                            </Link>
                        </li>
                    </ul>
                </div> */}
            </div>
        </div>


    );
};

export default ProductListTable;