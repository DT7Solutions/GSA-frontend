import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";

const CarModelVariants = () => {
    const token = localStorage.getItem("accessToken");
    const [carVariants, setCarVariants] = useState([]);
    const [carMakes, setCarMakes] = useState([]);
    const [getCarMake, setGetCarBrand] = useState([]);
    const [carModels, setCarModels] = useState([]);
    const [carVariantModel, setCarVariantModel] = useState([]);
    const [showCarVariantModal, setShowCarVariantModal] = useState(false);
    const [editingVariantId, setEditingVariantId] = useState(null);




    const [carVariantData, setCarVariantData] = useState({
        carModel: "",
        name: "",
        productionStart: "",
        productionEnd: "",
        chassisType: "",
        engine: "",
        description: ""
    });

    // Fetch car variant list
    useEffect(() => {
        fetchCarVariants();
        fetchCarMakes();
        fetchCarModels();
        fetchCarModelDetails();
    }, []);

    const fetchCarVariants = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car_model_varian_list/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCarVariants(response.data);
        } catch (error) {
            console.error("Error fetching car variants:", error);
        }
    };

    const fetchCarMakes = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-makes/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCarMakes(response.data);
        } catch (error) {
            console.error("Error fetching car makes:", error);
        }
    };

    const fetchCarModels = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-models/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCarModels(response.data);
        } catch (error) {
            console.error("Error fetching car makes:", error);
        }

        


    };


    // 2. Fetch a single car model's details using ID
const fetchCarModelDetails = async (carModels_id) => {
       debugger;
    try {
        const response = await axios.get(`${API_BASE_URL}api/home/car-model/${carModels_id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        debugger;
        setGetCarBrand(response.data);
        debugger;

    } catch (error) {
        console.error("Error fetching car model details:", error);
    }
};



    const handleEdit = async (variant) => {
        setEditingVariantId(variant.id);
        fetchCarModelDetails(variant.car_model)
        setCarVariantData({
            id: variant.id,
            carModel: variant.car_model,
            name: variant.name,
            productionStart: variant.production_start_date,
            productionEnd: variant.production_end_date,
            chassisType: variant.chassis_type,
            engine: variant.engine,
            description: variant.description || "",
        });

        setShowCarVariantModal(true);
    };



const handleCarMakeChange = async (e) => {
    const selectedMakeId = e.target.value;

    // Set selected brand temporarily (optional, if needed)
    setGetCarBrand({ car_make: selectedMakeId });

    // Clear selected model first
    setCarVariantData((prevData) => ({
        ...prevData,
        carModel: "", // Clear previous selection
    }));

    // Fetch models for selected brand
    try {
        const response = await axios.get(`${API_BASE_URL}api/home/car_model_list/${selectedMakeId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setCarModels(response.data); 
    } catch (error) {
        console.error("Error fetching car models:", error);
        setCarModels([]); 
    }
};



    const handleUpdateCarVariant = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}api/home/car_model_varian_update/${editingVariantId}/`, {
                car_model: carVariantData.carModel,
                name: carVariantData.name,
                production_start_date: carVariantData.productionStart,
                production_end_date: carVariantData.productionEnd,
                chassis_type: carVariantData.chassisType,
                engine: carVariantData.engine,
                description: carVariantData.description,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire("Updated!", "Car Variant has been updated.", "success");
            setShowCarVariantModal(false);
            fetchCarVariants();
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire("Error", "Something went wrong.", "error");
        }
    };

    return (
        <div className="card basic-data-table">
            {/* <div className="card-header">
                <h5 className="card-title mb-0">Car Variants List</h5>
            </div> */}
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table bordered-table mb-0 sm-table ">
                        <thead>
                            <tr>
                                <th>S.L</th>
                                <th>Model Name</th>
                                <th>Variant Name</th>
                                <th>Region</th>
                                <th>Engine</th>
                                <th>Chassis Type</th>
                                <th>Production (start - end)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carVariants.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.car_model_name}</td>
                                    <td>{item.name}</td>
                                    <td>{item.region}</td>
                                    <td>{item.engine}</td>
                                    <td>{item.chassis_type}</td>
                                    <td>{item.production_start_date} - {item.production_end_date}</td>
                                    <td>
                                        <button
                                            className="btn-theme-admin py-3"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <Icon icon="lucide:edit" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCarVariantModal && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Car Variant</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCarVariantModal(false)}>X</button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdateCarVariant} className="input-style">
                                    <div className="mb-3">
                                        <label className="form-label">Select Car Brand</label>
                                        <select
                                            className="form-select"
                                            value={getCarMake.car_make}
                                            onChange={handleCarMakeChange}
                                        >
                                            <option value="">-- Select Car Brand --</option>
                                            {carMakes.map((make) => (
                                                <option key={make.id} value={make.id}>{make.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Select Car Model</label>
                                        <select
                                            className="form-select"
                                            value={carVariantData.carModel}
                                            onChange={(e) =>
                                                setCarVariantData({ ...carVariantData, carModel: e.target.value })
                                            }
                                            required
                                        >
                                            <option value="">-- Select Car Model --</option>
                                            {carModels.map((model) => (
                                                <option key={model.id} value={model.id}>{model.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Variant Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter variant name"
                                            value={carVariantData.name}
                                            onChange={(e) =>
                                                setCarVariantData({ ...carVariantData, name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Production Start</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={carVariantData.productionStart}
                                                onChange={(e) =>
                                                    setCarVariantData({ ...carVariantData, productionStart: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Production End</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={carVariantData.productionEnd}
                                                onChange={(e) =>
                                                    setCarVariantData({ ...carVariantData, productionEnd: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Chassis Type</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter chassis type"
                                                value={carVariantData.chassisType}
                                                onChange={(e) =>
                                                    setCarVariantData({ ...carVariantData, chassisType: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Engine</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter engine type"
                                                value={carVariantData.engine}
                                                onChange={(e) =>
                                                    setCarVariantData({ ...carVariantData, engine: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            placeholder="Enter description..."
                                            value={carVariantData.description}
                                            onChange={(e) =>
                                                setCarVariantData({ ...carVariantData, description: e.target.value })
                                            }
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Update Car Variant</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarModelVariants;
