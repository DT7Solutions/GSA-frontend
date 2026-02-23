import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";

function ActionMenu({ item, setProductList }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {

    const result = await Swal.fire({
        title: "Are you sure?",
        text: "This product will be marked as deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
        const response = await axios.patch(
        `${API_BASE_URL}api/home/carparts/${item.id}/status/`,
        { status: "deleted" },
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }
        );

        await Swal.fire({
        title: "Deleted!",
        text: "Product has been marked as deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
        });

        // Option 1: Refresh entire list
        // refreshList();

        // Option 2 (better UX): Remove item locally
        setProductList(prev => prev.filter(p => p.id !== item.id));

    } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire({
        title: "Error!",
        text: "Something went wrong while deleting.",
        icon: "error",
        confirmButtonColor: "#d33"
        });
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-lg btn-light"
        type="button"
        data-bs-toggle="dropdown"
      >
        <Icon icon="lucide:more-vertical" />
      </button>

      <div className="dropdown-menu p-2">
        <div className="d-flex gap-2">
            <button
                className="btn btn-light btn-sm bg-white text-primary"
                onClick={() => navigate(`/update-products/${item.id}`)}
            >
                <Icon icon="lucide:edit" className="me-2" width="24" height="24" />
            </button>

            <button
                className="btn btn-light btn-sm bg-white text-danger"
                onClick={handleDelete}
            >
                <Icon icon="lucide:trash" className="me-2" width="24" height="24" />
            </button>
        </div>
      </div>
    </div>
  );
}

const ProductListDisplay = () => {
    const [products, setProductList] = useState([]);
    const token = localStorage.getItem("accessToken");
    const [loading, setLoading] = useState(false);
    const [makeFilter, setMakeFilter] = useState('');
    const [modelFilter, setModelFilter] = useState('');
    const [variantFilter, setVariantFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchProductList = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_BASE_URL}api/home/car-parts-list/`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

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
    setCurrentPage(1);
    }, [makeFilter, modelFilter, variantFilter, sectionFilter]);

    const filteredProducts = products.filter((item) => {
        const makeName = item.car_make?.name || "";
        const modelName = item.car_model?.name || "";
        const variantName = item.car_variant?.name || "";
        const sectionName = item.part_section?.name || "";

        return (
            (!makeFilter || makeName === makeFilter) &&
            (!modelFilter || modelName === modelFilter) &&
            (!variantFilter || variantName === variantFilter) &&
            (!sectionFilter || sectionName === sectionFilter)
        );
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

    const safeCurrentPage =
    currentPage > totalPages ? totalPages : currentPage;

    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    const currentItems = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
    );

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
                            className="form-select"
                            value={makeFilter}
                            onChange={(e) => setMakeFilter(e.target.value)}
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
                        <select
                            className="form-select"
                            value={modelFilter}
                            onChange={(e) => setModelFilter(e.target.value)}
                        >
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
                        <select
                            className="form-select"
                            value={variantFilter}
                            onChange={(e) => setVariantFilter(e.target.value)}
                        >
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
                        <select
                            className="form-select"
                            value={sectionFilter}
                            onChange={(e) => setSectionFilter(e.target.value)}
                        >
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
                    <table className="table table-striped table-bordered sm-table" style={{ width: "100%" }}>
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
                                currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{startIndex + index + 1}</td>
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
                                            <ActionMenu item={item} setProductList={setProductList} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between align-items-center mt-3">

                    <div>
                    {filteredProducts.length === 0 ? (
                        "No entries found"
                    ) : (
                        <>
                        Showing {startIndex + 1} to{" "}
                        {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{" "}
                        {filteredProducts.length} entries
                        </>
                    )}
                    </div>

                    <div>
                        <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        disabled={safeCurrentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                        Previous
                        </button>

                        <span className="mx-2">
                        Page {safeCurrentPage} of {totalPages || 1}
                        </span>

                        <button
                        className="btn btn-sm btn-outline-secondary"
                        disabled={safeCurrentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                        Next
                        </button>
                    </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductListDisplay;