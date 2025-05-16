import React, { useEffect, useState } from "react";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";


const ProductListDisplay = () => {
    const [products, setProductList] = useState([]);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchProductList = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-parts-list/`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setProductList(response.data); // update state with the product list
          } catch (error) {
            console.error('Error fetching product list:', error);
          }
        };
    
        fetchProductList();
      }, []);

    // useEffect(() => {
    //     const table = $('#dataTable').DataTable({
    //         pageLength: 10,
    //         destroy: true,
    //     });
    //     return () => {
    //         table.destroy(true);
    //     };
    // }, [products]);

    return (
        <div className="card basic-data-table">
            <div className="card-header">
                <h5 className="card-title mb-0">Product List</h5>
            </div>
            <div className="card-body">
                <table className="table bordered-table mb-0" id="dataTable" data-page-length={10}>
                    <thead>
                        <tr>
                            <th scope="col">
                                <div className="form-check style-check d-flex align-items-center">
                                    <input className="form-check-input" type="checkbox" />
                                    <label className="form-check-label">S.L</label>
                                </div>
                            </th>
                            <th scope="col">Brand</th>
                            <th scope="col">Model</th>
                            <th scope="col">Variant</th>
                            <th scope="col">Section</th>
                            <th scope="col">Group</th>
                            <th scope="col">Figure No</th>
                            <th scope="col">Part No</th>
                            <th scope="col" className='dt-orderable-asc dt-orderable-desc'>Price</th>
                            <th scope="col" className='dt-orderable-asc dt-orderable-desc'>Sale Price</th>
                            <th scope="col">Discount</th>
                            <th scope="col">Qty</th>
                            <th scope="col">SKU</th>
                            <th scope="col">Stock</th>
                            <th scope="col">Remarks</th>
                            <th scope="col">Description</th>
                            <th scope="col">Compatibility</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item, index) => (
                            <tr key={item.id}>
                                <td>
                                    <div className="form-check style-check d-flex align-items-center">
                                        <input className="form-check-input" type="checkbox" />
                                        <label className="form-check-label">{index + 1}</label>
                                    </div>
                                </td>
                                <td>{item.car_make?.name}</td>
                                <td>{item.car_model?.name}</td>
                                <td>{item.car_variant?.name}</td>
                                <td>{item.part_section?.name}</td>
                                <td>{item.part_group?.name}</td>
                                <td>{item.fig_no}</td>
                                <td>{item.part_no}</td>
                                <td>₹{item.price}</td>
                                <td>₹{item.sale_price}</td>
                                <td>{item.discount}%</td>
                                <td>{item.qty}</td>
                                <td>{item.sku}</td>
                                <td>{item.stock_count}</td>
                                <td>{item.remarks}</td>
                                <td>{item.description}</td>
                                <td>{`${item.car_make?.name} ${item.car_model?.name} ${item.car_variant?.name}`}</td>
                                <td>
                                    <Link to="#" className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center">
                                        <Icon icon="iconamoon:eye-light" />
                                    </Link>
                                    <Link to="#" className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center">
                                        <Icon icon="lucide:edit" />
                                    </Link>
                                    <Link to="#" className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center">
                                        <Icon icon="mingcute:delete-2-line" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductListDisplay;