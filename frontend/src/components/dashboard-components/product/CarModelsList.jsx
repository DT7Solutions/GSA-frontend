import React, { useEffect, useState } from "react";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react';
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";

const CarModelsDisplay = () => {
    const [carbrands, setCarBrandsList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [carMakes, setCarMakes] = useState([]);
    
    const [carModelData, setCarModelData] = useState({
        car: '',
        modelName: '',
        bodyType: '',
        generation: '',
        MproductionStart: '',
        MproductionEnd: '',
        fuelType: '',
        image: null
    });

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchCarBrandsList();
        fetchCarMakes();
    }, []);

    const fetchCarBrandsList = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-models/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCarBrandsList(response.data);
        } catch (error) {
            console.error('Error fetching car brands list:', error);
        }
    };

    const fetchCarMakes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-makes/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCarMakes(response.data);
        } catch (error) {
            console.error('Error fetching car makes:', error);
        }
    };

    const handleEditClick = (item) => {
        setIsEdit(true);
        debugger;
        const selectedMake = carMakes.find(make => make.name.toLowerCase() === item.car_make_name.toLowerCase());
        setCarModelData({
            id: item.id,
            car: selectedMake?.id || "",
            modelName: item.name,
            bodyType: item.body_type,
            generation: item.generation,
            MproductionStart: item.production_start_date,
            MproductionEnd: item.production_end_date,
            fuelType: item.fuel_type?.toLowerCase(),
            image: null
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEdit(false);
        setCarModelData({
            car: '',
            modelName: '',
            bodyType: '',
            generation: '',
            MproductionStart: '',
            MproductionEnd: '',
            fuelType: '',
            image: null
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCarModelData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setCarModelData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

   const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("car", carModelData.car);
    formData.append("name", carModelData.modelName);
    formData.append("body_type", carModelData.bodyType);
    formData.append("generation", carModelData.generation);
    formData.append("production_start_date", carModelData.MproductionStart);
    formData.append("production_end_date", carModelData.MproductionEnd);
    formData.append("fuel_type", carModelData.fuelType);

    if (carModelData.image) {
        formData.append("image", carModelData.image);
    }

    try {
        debugger;
        await axios.put(
            `${API_BASE_URL}api/home/car_models_update/${carModelData.id}/`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        Swal.fire("Updated!", "Car model updated successfully.", "success");
        fetchCarBrandsList();
        setShowModal(false);
        setCarModelData({
            id: null,
            car: '',
            modelName: '',
            bodyType: '',
            generation: '',
            MproductionStart: '',
            MproductionEnd: '',
            fuelType: '',
            image: null
        });
        setIsEdit(false);

    } catch (error) {
        console.error('Error updating car model:', error);
        Swal.fire("Error", "Something went wrong while updating.", "error");
    }
};


    return (
        <div className="card basic-data-table">
            <div className="card-header">
                <h5 className="card-title mb-0">Car Brands List</h5>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table bordered-table mb-0">
                        <thead>
                            <tr>
                                <th>S.L</th>
                                <th>Model Image</th>
                                <th>Brand Name</th>
                                <th>Model Name</th>
                                <th>Generation</th>
                                <th>Body Type</th>
                                <th>Fuel Type</th>
                                <th>Production (start-end)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carbrands.map((item, index) => (
                                <tr key={item.id}>

                                    <td>{index + 1}</td>
                                    <td>
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt="part"
                                                style={{ width: "60px", height: "40px", objectFit: "cover" }}
                                            />
                                        )}
                                    </td>
                                    <td>{item.car_make_name}</td>
                                    <td>{item.name}</td>
                                    <td>{item.generation}</td>
                                    <td>{item.body_type}</td>
                                    <td>{item.fuel_type}</td>
                                    <td>{item.production_start_date} - {item.production_end_date}</td>
                                    <td>
                                        <button
                                            onClick={() => handleEditClick(item)}
                                            className="btn btn-sm btn-success"
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

                {showModal && (
                    <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{isEdit ? "Edit Car Model" : "Add Car Model"}</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseModal}>X</button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label>Select Car Brand</label>
                                            <select
                                                name="car"
                                                className="form-control"
                                                value={carModelData.car}
                                                onChange={(e) =>
                                                    setCarModelData({ ...carModelData, car: e.target.value })
                                                }
                                                required
                                            >
                                                <option value="">-- Select Brand --</option>
                                                {carMakes.map(make => (
                                                    <option key={make.id} value={make.id}>{make.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label>Model Name</label>
                                            <input
                                                type="text"
                                                name="modelName"
                                                className="form-control"
                                                value={carModelData.modelName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label>Body Type</label>
                                            <input
                                                type="text"
                                                name="bodyType"
                                                className="form-control"
                                                value={carModelData.bodyType}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label>Generation</label>
                                            <input
                                                type="text"
                                                name="generation"
                                                className="form-control"
                                                value={carModelData.generation}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        {/* <div className="row mb-3">
                                            <div className="col">
                                                <label>Production Start</label>
                                                <input
                                                    type="date"
                                                    name="MproductionStart"
                                                    className="form-control"
                                                    value={carModelData.MproductionStart}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col">
                                                <label>Production End</label>
                                                <input
                                                    type="date"
                                                    name="MproductionEnd"
                                                    className="form-control"
                                                    value={carModelData.MproductionEnd}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div> */}

                                        <div className="mb-3">
                                            <label>Fuel Type {carModelData.fuelType} </label>
                                            <select
                                                name="fuelType"
                                                className="form-control"
                                                value={carModelData.fuelType}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">---Select Fuel--</option>
                                                <option value="petrol">Petrol</option>
                                                <option value="diesel">Diesel</option>
                                                <option value="electric">Electric</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label>Image</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                onChange={handleFileChange}
                                            />
                                        </div>

                                        <button type="submit" className="btn btn-primary">
                                            {isEdit ? "Update" : "Save"}
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

export default CarModelsDisplay;
