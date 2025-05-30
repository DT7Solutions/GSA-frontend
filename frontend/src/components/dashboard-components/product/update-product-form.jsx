import { Icon } from '@iconify/react';
import React, { useEffect, useState } from "react";
import Select from 'react-select';
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";
import { useParams } from 'react-router-dom';

const UpdateProductsForm = () => {
    const { id } = useParams();
    const token = localStorage.getItem("accessToken");
    const [selectedParts, setSelectedParts] = useState([]);
    const [partOptions, setPartOptions] = useState([]);
    const [carMakes, setCarMakes] = useState([]);
    const [carModels, setCarModels] = useState([]);

    
    const [selectedCarMake, setSelectedCarMake] = useState();
    const [carModelList, setcarModelList] = useState([]);
    

      // Handle save product 
    const [formData, setFormData] = useState({
        carMakeId: '',
        carModelId: '',
        carVariantId: '',
        partCategoryId: '',
        partId: '',
        partNumber: '',
        figureNumber: '',
        price: '',
        salePrice: '',
        discount: '',
        qty: '',
        sku: '',
        remarks: '',
        compatibility: [],
        description: ''
    });

    // Handle Part Compatibility
    // const handleChange = (selectedOptions) => {
    //     setSelectedParts(selectedOptions);
    //     setFormData((formData) => ({
    //         ...formData,
    //         compatibility: selectedOptions,
    //     }));
    //     console.log("Selected Parts:", selectedOptions);
    // }


    // const carOptions = carMakes.map(make => ({
    //     value: make.id,
    //     label: make.name
    //   }));
      
// setSelectedParts(formData.compatibility.map(item => ({
//     label: item.name, value: item.id
// })));


    // Handle final product save logic 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${API_BASE_URL}api/home/car-parts-list/${id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire({
                title: "Success Created Car Part Sucessfully",
                text: response.data.message,
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to save part";
            Swal.fire({
                title: "Request Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Retry",
            });
        }
    };


    useEffect(() => {
    const fetchProductData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-parts-list/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;
            const carMakeId = data.car_make?.id || '';
            const carModelId = data.car_model?.id || '';


            setFormData({
                carMakeId: data.car_make?.id || '',
                carModelId: data.car_model?.id || '',
                carVariantId: data.car_variant?.id || '',
                partCategoryId: data.part_group?.id || '',
                partId: '',
                partNumber: data.part_no || '',
                figureNumber: data.fig_no || '',
                price: data.price || '',
                salePrice: data.sale_price || '',
                discount: data.discount || '',
                qty: data.qty || '',
                sku: data.sku || '',
                remarks: data.remarks || '',
                compatibility: [], 
                description: data.description || '',
            });

            fetchCarMakes(carMakeId);
            fetchCarModel(carMakeId)




        } catch (error) {
            console.error("Error fetching product data:", error);
            Swal.fire({
                title: "Failed to fetch product data",
                text: error.message,
                icon: "error",
            });
        }
    };


     const fetchCarMakes = async (carMakeId) => {
        try {
            debugger;
            const response = await axios.get(`${API_BASE_URL}api/home/car-makes/`);
            setCarMakes(response.data);
            const get_car_makeId = carMakeId;
            const defaultMake = response.data.find(make => make.id === get_car_makeId);
            debugger
            if (defaultMake) {
                setSelectedCarMake({ value: defaultMake.id, label: defaultMake.name });
                // handleCarMakeChange({ target: { value: defaultMake.id } });
            }

        } catch (error) {
            console.error('Error fetching car makes:', error);
        }

        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-models/${carMakeId}/`);
            setCarModels(response.data);

        } catch (error) {
            console.error("Error fetching car models:", error);
        }

    };
      const fetchCarModel = async (carModelId) => {
                try {
                    const response = await axios.get(`${API_BASE_URL}api/home/car-models/`);
                    setcarModelList(response.data);
    
                    const options = response.data.map(item => ({
                        value: item.id,
                        label: `${item.name} (${item.fuel_type})(${item.production_start_date} - ${item.production_end_date})`
                    }));
    
                    setPartOptions(options);
    
                } catch (error) {
                    console.error('Error fetching car makes:', error);
                }
    };



    fetchProductData();
}, [id, token]);



   



    return (
        <div className="col-lg-12">
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title mb-0">Update Products</h5>
                </div>
                <div className="card-body">
                    <form className="row gy-3 needs-validation input-style" noValidate onSubmit={handleSubmit}>
                        {/* Car Brand Selection */}
                         <div className="col-md-4">
                            <label className="form-label">Select Car</label>
                            <div className="input-group has-validation">
                                <div className='search-select'>
                                    <Select
                                        className="basic-single input-g"
                                        classNamePrefix="select"
                                        options={carMakes.map(make => ({
                                            value: make.id,
                                            label: make.name,
                                        }))}
                                        value={selectedCarMake} 
                                        onChange={(selectedOption) => {
                                            setSelectedCarMake(selectedOption); 
                                            // handleCarMakeChange({ target: { value: selectedOption.value } }); 
                                        }}
                                        placeholder="-- Select Your Car --"
                                        isSearchable={true}
                                    />
                                </div>
                                {/* <button
                                    type="button"
                                    className="input-group-text bg-base"
                                    // onClick={() => setShowModal(true)}
                                >
                                    <Icon icon="lucide:plus" /> Add Car
                                </button> */}
                            </div>
                        </div>

                        {/* Car model Selection */}
                        <div className="col-md-4">
                            <label className="form-label">Select Car Model</label>
                            <div className="input-group has-validation">
                                <select className="form-select form-select input-g" >
                                    <option >-- select car model --</option>
                                    {carModels.map((model) => (
                                        <option value={model.id}>{model.name}{model.generation}({new Date(model.production_start_date).getFullYear()} - {new Date(model.production_end_date).getFullYear()})
                                        </option>
                                    ))}
                                </select>
                                {/* <button
                                    type="button"
                                    className="input-group-text bg-base"
                                    onClick={() => setShowCarModelModal(true)}
                                >
                                    <Icon icon="lucide:plus" /> Add Model
                                </button> */}
                            </div>
                        </div>



                    {/* paert section  */}
                        <div className="col-md-4">
                            <label className="form-label">Part Number</label>
                            <input
                                type="text"
                                name="#0"
                                className="form-control"
                                value={formData.partNumber}
                                placeholder="Enter part number,"
                                onChange={(e) =>
                                    setFormData({ ...formData, partNumber: e.target.value })
                                }
                                required
                            />
                            <div className="invalid-feedback">Please part number</div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Part figure Number</label>
                            <input
                                type="text"
                                name="#0"
                                value={formData.figureNumber}
                                className="form-control"
                                placeholder="Enter figure no,"
                                onChange={(e) =>
                                    setFormData({ ...formData, figureNumber: e.target.value })
                                }
                                required
                            />
                            <div className="invalid-feedback">Please figure number</div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Price</label>
                            <input
                                type="number"
                                name="#0"
                                 value={formData.price}
                                className="form-control"
                                placeholder="Enter part price,"
                                onChange={(e) =>
                                    setFormData({ ...formData, price: e.target.value })
                                }
                                required
                            />
                            <div className="invalid-feedback">Please part price</div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Sale Price</label>
                            <input
                                type="number"
                                name="#0"
                                value={formData.salePrice}
                                className="form-control"
                                placeholder="Enter part sale price"
                                onChange={(e) =>
                                    setFormData({ ...formData, salePrice: e.target.value })
                                }
                                required
                            />
                            <div className="invalid-feedback">Please part sale price</div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Part discount</label>
                            <input
                                type="number"
                                name="#0"
                                value={formData.discount}
                                className="form-control"
                                placeholder="Enter discount"
                                onChange={(e) =>
                                    setFormData({ ...formData, discount: e.target.value })
                                }
                                required
                            />
                            <div className="invalid-feedback">Please discount.</div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Part QTY</label>
                            <input
                                type="number"
                                name="#0"
                                value={formData.qty}
                                className="form-control"
                                placeholder="Enter number of QTY,"
                                onChange={(e) =>
                                    setFormData({ ...formData, qty: e.target.value })
                                }
                                required
                            />
                            <div className="invalid-feedback">Please provide qty.</div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Part SKU</label>
                            <input
                                type="text"
                                name="#0"
                                    value={formData.sku}
                                className="form-control"
                                placeholder="Enter number of sku,"
                                onChange={(e) =>
                                    setFormData({ ...formData, sku: e.target.value })
                                }
                                required
                            />
                            <div className="invalid-feedback">Please provide sku.</div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Remarks</label>
                            <input
                                type="text"
                                name="#0"
                                value={formData.remarks}
                                className="form-control"
                                placeholder="Enter remarks,"
                                onChange={(e) =>
                                    setFormData({ ...formData, remarks: e.target.value })
                                }
                                required
                            />
                        </div>
                        {/* Part Compatibility */}
                        {/* <div className="col-md-8">
                            <label className="form-label">Part Compatibility</label>
                            <div className="input-group">
                                <Select
                                    options={partOptions}
                                    isMulti
                                    value={"i10"}
                                    onChange={handleChange}
                                    className="w-100 multi-select2"
                                />
                            </div>
                        </div> */}

                        <div class="col-lg-8 was-validated">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" rows="4" cols="50" placeholder="Enter a description..."
                             value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }>
                            </textarea>
                            <div class="invalid-feedback">Please enter a message in the textarea.</div>
                        </div>


                        <div className="col-12">
                            <button className="btn btn-primary-600 style2" type="submit">
                                Update Car Part
                            </button>
                        </div>
                    </form>

                </div>
            </div>

            
        </div>
    );
};

export default UpdateProductsForm;
