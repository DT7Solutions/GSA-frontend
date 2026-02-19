import React, { useEffect, useState } from "react";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';

import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../../../config";

const ProductListDisplay = () => {
    const [products, setProductList] = useState([]);
    const token = localStorage.getItem("accessToken");
    const [loading, setLoading] = useState(false);

    const fetchProductList = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}api/home/car-parts-list/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProductList(response.data);
        } catch (error) {
            console.error('Error fetching product list:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductList();
    }, [token]);

    useEffect(() => {
        let table;
        if (!loading && products.length > 0) {
            table = $('#dataTable').DataTable({
                destroy: true,
                deferRender: true,
                pageLength: 10,
                searching: true,
                ordering: true,
                lengthMenu: [5, 10, 25, 50, 100],
                language: {
                    search: "Filter records:",
                }
            });

        $.fn.dataTable.ext.search.push(function (settings, data) {

            const make = $('#makeFilter').val();
            const model = $('#modelFilter').val();
            const variant = $('#variantFilter').val();
            const section = $('#sectionFilter').val();

            const carDetails = data[1]; // Column index of Car Details

            const matchMake = !make || carDetails.includes(make);
            const matchModel = !model || carDetails.includes(model);
            const matchVariant = !variant || carDetails.includes(variant);
            const matchSection = !section || carDetails.includes(section);

            return matchMake && matchModel && matchVariant && matchSection;
        });

        $('#makeFilter, #modelFilter, #variantFilter, #sectionFilter').on('change', function () {
            table.draw();
        });

        }

        return () => {
            if (table) {
                table.destroy(true);
            }
        };

    }, [products, loading]);

    // Helper function to display compatible models
    const getCompatibilityDisplay = (compatibility) => {
        if (!compatibility || compatibility.length === 0) {
            return "N/A";
        }
        
        return compatibility
            .map(comp => `${comp.compatible_model_name} (${comp.generation})`)
            .join(", ");
    };

    return (
        <div className="card basic-data-table">
            <div className="card-body">
                <div className="row mb-3">
                    <div className="col-md-3">
                        <select
                            id="makeFilter"
                            className="form-select"
                        >
                            <option value="">All Makes</option>
                            {[...new Set(products.map(p => p.car_make?.name))]
                                .filter(Boolean)
                                .map((make, index) => (
                                    <option key={index} value={make}>
                                        {make}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select id="modelFilter" className="form-select">
                            <option value="">All Models</option>
                            {[...new Set(products.map(p => p.car_model?.name))]
                                .filter(Boolean)
                                .map((model, index) => (
                                    <option key={index} value={model}>
                                        {model}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select id="variantFilter" className="form-select">
                            <option value="">All Variants</option>
                            {[...new Set(products.map(p => p.car_variant?.name))]
                                .filter(Boolean)
                                .map((variant, index) => (
                                    <option key={index} value={variant}>
                                        {variant}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select id="sectionFilter" className="form-select">
                            <option value="">All Sections</option>
                            {[...new Set(products.map(p => p.part_section?.name))]
                                .filter(Boolean)
                                .map((section, index) => (
                                    <option key={index} value={section}>
                                        {section}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="display table table-striped table-bordered sm-table" id="dataTable" style={{ width: "100%" }}>
                        <thead className="bg-theme-table">
                            <tr>
                                <th className="bg-theme-color">S.L</th>
                                <th className="bg-theme-color">Car Details</th>
                                <th className="bg-theme-color">Part Name</th>
                                <th className="bg-theme-color">Figure No</th>
                                <th className="bg-theme-color">Part No</th>
                                <th className="bg-theme-color">Price</th>
                                <th className="bg-theme-color">Sale Price</th>
                                <th className="bg-theme-color">Discount</th>
                                <th className="bg-theme-color">Qty</th>
                                <th className="bg-theme-color">SKU</th>
                                <th className="bg-theme-color">Stock</th>
                                <th className="bg-theme-color">Remarks</th>
                                <th className="bg-theme-color">Description</th>
                                <th className="bg-theme-color">Compatible Models</th>
                                <th className="bg-theme-color">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                    <tr>
                                        <td colSpan="15" style={{ textAlign: "center", padding: "40px 0" }}>
                                            <div className="d-flex flex-column align-items-center justify-content-center">
                                                <div className="spinner-border text-primary mb-3" role="status"></div>
                                                <strong>Loading products...</strong>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                products.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {item.car_make?.name}-{item.car_model?.name}-
                                            {item.car_variant?.name}-{item.part_section?.name}
                                        </td>
                                        <td>{item.product_name}</td>
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
                                        <td>
                                            <small>
                                                {getCompatibilityDisplay(item.compatibilities)}
                                            </small>
                                        </td>
                                        <td>
                                            <Link
                                                to={`/update-products/${item.id}`}
                                                className="btn-theme-admin py-3"
                                                title="Edit"
                                            >
                                                <Icon icon="lucide:edit" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductListDisplay;