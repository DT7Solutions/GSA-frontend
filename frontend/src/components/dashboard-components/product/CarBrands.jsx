import React, { useEffect, useState } from "react";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react';
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";

const CarBrandDisplay = () => {
    const [carbrands, setCarBrandsList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [carBrandData, setCarBrandData] = useState({
        id: null,
        brandname: "",
        image: null
    });

    const token = localStorage.getItem("accessToken");

    // Fetch car brands
    const fetchCarBrandsList = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-makes/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCarBrandsList(response.data);
        } catch (error) {
            console.error('Error fetching car brands list:', error);
        }
    };

    useEffect(() => {
        fetchCarBrandsList();
    }, []);

    const handleAddCar = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", carBrandData.brandname);
        formData.append("image", carBrandData.image);

        try {
            await axios.put(`${API_BASE_URL}api/home/car_makes_update/${carBrandData.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            Swal.fire("Updated!", "Car brand updated successfully.", "success");

            fetchCarBrandsList(); // Refresh list
            setShowModal(false);  // Close modal
            setCarBrandData({ id: null, brandname: "", image: null }); // Reset form
            setIsEdit(false);     // Reset edit mode

        } catch (error) {
            console.error('Error updating car brand:', error);
            Swal.fire("Error", "Something went wrong while updating.", "error");
        }
    };

    const handleEditClick = (brand) => {
        setIsEdit(true);
        setCarBrandData({ id: brand.id, brandname: brand.name, image: null });
        setShowModal(true);
    };

    const handleAddClick = () => {
        setIsEdit(false);
        setCarBrandData({ id: null, brandname: "", image: null });
        setShowModal(true);
    };

    return (
        <div className="card basic-data-table">
            {/* <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Car Brands List</h5>
               
            </div> */}
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table bordered-table mb-0 sm-table" id="dataTable" data-page-length={10}>
                        <thead>
                            <tr>
                                <th>S.L</th>
                                <th>Brand Name</th>
                                <th>Brand Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carbrands.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt="part"
                                                style={{ width: "60px", height: "40px", objectFit: "cover" }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleEditClick(item)}
                                            className="w-32-px h-32-px me-2 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                            title="Edit"
                                        >
                                            <Icon icon="lucide:edit" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal for Add/Edit */}
                {showModal && (
                    <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{isEdit ? "Update Car Brand" : "Add New Car Brand"}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}>X</button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleAddCar} className="input-style">
                                        <div className="mb-3">
                                            <label className="form-label">Car Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={carBrandData.brandname}
                                                onChange={(e) =>
                                                    setCarBrandData({ ...carBrandData, brandname: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Upload Car Image</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={(e) =>
                                                    setCarBrandData({ ...carBrandData, image: e.target.files[0] })
                                                }
                                                accept="image/*"
                                                required={!isEdit} // Optional during edit
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary style2">
                                            {isEdit ? "Update Car" : "Save Car"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarBrandDisplay;
