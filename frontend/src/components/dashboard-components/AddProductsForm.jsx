import { Icon } from '@iconify/react';
import React, { useEffect, useState } from "react";
import Select from 'react-select';
import axios from "axios";
import API_BASE_URL from "../../config";
import Swal from "sweetalert2";
import BulkProductUpload from './BulkProductUpload'; // Adjust path as needed
 


const AddProductsForm = () => {
    const [showModal, setShowModal] = useState(false);
    const [showCarModelModal, setShowCarModelModal] = useState(false);
    const [showCarVariantModal, setShowCarVariantModal] = useState(false);
    const [showPartSelectionCatModal, setShowPartSelectionCatModal] = useState(false);
    const [showPartGroupModal, setShowPartGroupModal] = useState(false);
    const [showPartCompatibilityModal, setShowPartCompatibilityModal] = useState(false);
    const [selectedParts, setSelectedParts] = useState([]);

    const token = localStorage.getItem("accessToken");

    const [carModels, setCarModels] = useState([]);
    const [carVariant, setModelVariant] = useState([]);
    const [CarModelVariant, setCarModelVariant] = useState([]);
    const [carPartCat, setcarPartCat] = useState([]);
    const [carcatGroup, setcarPartgroupItem] = useState([]);




    // State for Car Brand (Add Car)
    const [carBrandData, setCarBrandData] = useState({
        brandname: '',
        image: null,
    });

    // State for Car Model
    const [carModelData, setCarModelData] = useState({
        car: '',
        modelName: '',
        bodyType: '',
        fuelType: '',
        generation: '',
        MproductionStart: '',
        MproductionEnd: '',
        image: null,
    });

    // State for Car Variant
    const [carVariantData, setCarVariantData] = useState({
        carModel: '',
        name: '',
        region: '',
        productionStart: '',
        productionEnd: '',
        chassisType: '',
        description: '',
    });

    // State for Part Selection
    const [partSelectionData, setPartSelectionData] = useState({
        carVariant: '',
        name: '',
        image: null,
    });

    // State for Part Selection
    const [partGrouponData, setPartGroupData] = useState({
        partcat: '',
        name: '',
        image: null,
    });


    // Handle save product 
    const [formData, setFormData] = useState({
        carMakeId: '',
        carModelId: '',
        carVariantId: '',
        partCategoryId: '',
        partId: '',
        partName: '',
        partImage: '',
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
    // console.log(formData)

    // Handle final product save logic 
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for required fields
    if (!formData.carMakeId) {
        Swal.fire({
            title: "Validation Error",
            text: "Please select a car",
            icon: "warning",
            confirmButtonText: "OK",
        });
        return;
    }
    
    if (!formData.carModelId) {
        Swal.fire({
            title: "Validation Error",
            text: "Please select a car model",
            icon: "warning",
            confirmButtonText: "OK",
        });
        return;
    }
    
    if (!formData.carVariantId) {
        Swal.fire({
            title: "Validation Error",
            text: "Please select a car variant",
            icon: "warning",
            confirmButtonText: "OK",
        });
        return;
    }
    
    if (!formData.partCategoryId) {
        Swal.fire({
            title: "Validation Error",
            text: "Please select a part category",
            icon: "warning",
            confirmButtonText: "OK",
        });
        return;
    }
    
    if (!formData.partId) {
        Swal.fire({
            title: "Validation Error",
            text: "Please select a part",
            icon: "warning",
            confirmButtonText: "OK",
        });
        return;
    }
    
    if (!formData.partName) {
        Swal.fire({
            title: "Validation Error",
            text: "Please enter part name",
            icon: "warning",
            confirmButtonText: "OK",
        });
        return;
    }
    
    if (!formData.partNumber) {
        Swal.fire({
            title: "Validation Error",
            text: "Please enter part number",
            icon: "warning",
            confirmButtonText: "OK",
        });
        return;
    }
    
    if (!formData.figureNumber) {
        Swal.fire({
            title: "Validation Error",
            text: "Please enter figure number",
            icon: "warning",
            confirmButtonText: "OK",
        });
        return;
    }
    
    if (!formData.salePrice) {
        Swal.fire({
            title: "Validation Error",
            text: "Please enter sale price",
            icon: "warning",
            confirmButtonText: "OK",
        });
        return;
    }
    
    if (!formData.qty) {
        Swal.fire({
            title: "Validation Error",
            text: "Please enter quantity",
            icon: "warning",
            confirmButtonText: "OK",
        });
        return;
    }
    
    if (!formData.sku) {
        Swal.fire({
            title: "Validation Error",
            text: "Please enter SKU",
            icon: "warning",
            confirmButtonText: "OK",
        });
        return;
    }
    
    if (!formData.remarks) {
        Swal.fire({
            title: "Validation Error",
            text: "Please enter HSN code",
            icon: "warning",
            confirmButtonText: "OK",
        });
        return;
    }
    
    // 🐛 DEBUG: Print form data before sending
    console.log("\n" + "=".repeat(80));
    console.log("🚀 SUBMITTING FORM - Form Data:");
    console.log("=".repeat(80));
    console.log("Form Data Object:", formData);
    console.log("\n🔗 Compatibility Data:");
    console.log("Type:", typeof formData.compatibility);
    console.log("Is Array:", Array.isArray(formData.compatibility));
    console.log("Length:", formData.compatibility?.length || 0);
    console.log("Value:", formData.compatibility);
    
    if (formData.compatibility && formData.compatibility.length > 0) {
        console.log("\n📋 Compatibility Items:");
        formData.compatibility.forEach((item, index) => {
            console.log(`   [${index}]:`, item);
            if (typeof item === 'object') {
                console.log(`      - value: ${item.value}`);
                console.log(`      - label: ${item.label}`);
            }
        });
    }
    console.log("=".repeat(80) + "\n");
    
    try {
        // Create FormData object
        const submitData = new FormData();
        
        // Append all fields
        submitData.append('carMakeId', formData.carMakeId);
        submitData.append('carModelId', formData.carModelId);
        submitData.append('carVariantId', formData.carVariantId);
        submitData.append('partCategoryId', formData.partCategoryId);
        submitData.append('partId', formData.partId);
        submitData.append('partName', formData.partName);
        submitData.append('partNumber', formData.partNumber);
        submitData.append('figureNumber', formData.figureNumber);
        submitData.append('price', formData.price);
        submitData.append('salePrice', formData.salePrice);
        submitData.append('discount', formData.discount);
        submitData.append('qty', formData.qty);
        submitData.append('sku', formData.sku);
        submitData.append('remarks', formData.remarks);
        submitData.append('description', formData.description);
        
        // Append image if exists
        if (formData.partImage) {
            submitData.append('partImage', formData.partImage);
        }
        
        // ✅ IMPORTANT: Convert compatibility to JSON string
        if (formData.compatibility && formData.compatibility.length > 0) {
            // Extract just the IDs from React Select format
            const compatibilityIds = formData.compatibility.map(item => 
                typeof item === 'object' ? item.value : item
            );
            console.log("🔄 Sending compatibility IDs:", compatibilityIds);
            submitData.append('compatibility', JSON.stringify(compatibilityIds));
        } else {
            console.log("⚠️ No compatibility data to send");
            submitData.append('compatibility', JSON.stringify([]));
        }

        submitData.append('status', 'active');
        
        // Debug: Print what's being sent
        console.log("\n📤 FormData being sent to backend:");
        for (let pair of submitData.entries()) {
            console.log(`   ${pair[0]}:`, pair[1]);
        }
        console.log("\n");
        
        const response = await axios.post(
            `${API_BASE_URL}api/home/create_car_part/`, 
            submitData, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        console.log("✅ Response from backend:", response.data);
        
        Swal.fire({
            title: "Success!",
            text: "Car Part Created Successfully",
            icon: "success",
            confirmButtonText: "OK",
        });
        
        // Optionally reset form
        // resetForm();
        
    } catch (error) {
        console.error("❌ Error submitting form:", error);
        console.error("Error response:", error.response?.data);
        
        const errorMessage = error.response?.data?.message || "Failed to save part";
        Swal.fire({
            title: "Request Failed",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "Retry",
        });
    }
};

    // Handle Add Car (Brand)
    const handleAddCar = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", carBrandData.brandname);
        formData.append("image", carBrandData.image);

        try {
            const response = await axios.post(`${API_BASE_URL}api/home/add_car/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            Swal.fire({
                title: "success created Car Brand",
                text: response.data.message,
                icon: "success",
                confirmButtonText: "OK",
            });

            setShowModal(false);
            setCarBrandData({ brandname: '', image: null });

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            Swal.fire({
                title: "Request Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Retry",
            });
        }
    };

    // bindin data 
    const [carMakes, setCarMakes] = useState([]);

    useEffect(() => {
        const fetchCarMakes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/home/car-makes/`);
                setCarMakes(response.data);
            } catch (error) {
                console.error('Error fetching car makes:', error);
            }
        };

        fetchCarMakes();
    }, []);



    // Handle Add Car Model
    const handleAddCarModel = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("car_make", carModelData.car);
        formData.append("name", carModelData.modelName);
        formData.append("body_type", carModelData.bodyType);
        formData.append("fuel_type", carModelData.fuelType);
        formData.append("generation", carModelData.generation);
        formData.append("production_start_date", carModelData.MproductionStart);
        formData.append("production_end_date", carModelData.MproductionEnd);
        formData.append("image", carModelData.image);


        try {
            const response = await axios.post(`${API_BASE_URL}api/home/add_car_model/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            Swal.fire({
                title: "success created Car Brand",
                text: response.data.message,
                icon: "success",
                confirmButtonText: "OK",
            });

            setShowModal(false);
            setCarBrandData({ brandname: '', image: null });

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            Swal.fire({
                title: "Request Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Retry",
            });
        }


    };

    const handleCarMakeChange = async (e) => {
        const makeId = parseInt(e.target.value);

        setFormData((formData) => ({
            ...formData,
            carMakeId: makeId,
        }));
        setCarModels([]);
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-models/${makeId}/`);
            setCarModels(response.data);

        } catch (error) {
            console.error("Error fetching car models:", error);
            setCarModels([]);
        }
    };

    const [carModelList, setcarModelList] = useState([]);

    const [partOptions, setPartOptions] = useState([]);

    useEffect(() => {
        const fetchCarModel = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/home/car-models/`);
                setcarModelList(response.data);

                const options = response.data.map(item => ({
                    value: item.id,
                    label: `${item.name} (${item.production_start_date} - ${item.production_end_date})`
                }));

                setPartOptions(options);

            } catch (error) {
                console.error('Error fetching car makes:', error);
            }
        };

        fetchCarModel();
    }, []);




    // Handle Add Car Variant
    const handleAddCarVariant = async (e) => {
        e.preventDefault();


        const formData = new FormData();
        formData.append("car_model", carVariantData.carModel);
        formData.append("name", carVariantData.name);
        formData.append("region", "India");
        formData.append("production_start_date", carVariantData.productionStart);
        formData.append("production_end_date", carVariantData.productionEnd);
        formData.append("chassis_type", carVariantData.chassisType);
        formData.append("engine", carVariantData.engine);
        formData.append("v_no", " ");
        formData.append("description", carVariantData.description);


        try {
            const response = await axios.post(`${API_BASE_URL}api/home/create_car_Variant/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            Swal.fire({
                title: "success created car variant",
                text: response.data.message,
                icon: "success",
                confirmButtonText: "OK",
            });

            setShowCarVariantModal(false);
            setCarVariantData({
                carModel: '',
                name: '',
                region: 'India',
                productionStart: '',
                productionEnd: '',
                chassisType: '',
                engine: '',
                description: '',
            });

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            Swal.fire({
                title: "Request Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Retry",
            });
        }
    };

    const [PartsCategoryList, setPartsCategoryList] = useState([]);

    useEffect(() => {
        const fetchCarMakes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/home/get_parts_category_list/`);
                setPartsCategoryList(response.data);
            } catch (error) {
                console.error('Error fetching car makes:', error);
            }
        };

        fetchCarMakes();
    }, []);



    const handleCarModelChange = async (e) => {
        const modelId = parseInt(e.target.value);
        setFormData((formData) => ({
            ...formData,
            carModelId: modelId,
        }));
        setModelVariant([]);
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car_variant/${modelId}/`);
            setModelVariant(response.data);

        } catch (error) {
            console.error("Error fetching car models:", error);
            setModelVariant([]);
        }
    };


    // Handle Add Part Selection
    const handleAddPartSelection = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("variant", partSelectionData.carVariant);
        formData.append("name", partSelectionData.name);
        formData.append("image", partSelectionData.image);

        console.log('Part Selection Data:', partSelectionData);
        try {
            const response = await axios.post(`${API_BASE_URL}api/home/create_car_part_categories/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            Swal.fire({
                title: "success created car category",
                text: response.data.message,
                icon: "success",
                confirmButtonText: "OK",
            });

            setShowPartSelectionCatModal(false);
            setPartSelectionData({ carVariant: '', name: '', partGroup: '' });

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            Swal.fire({
                title: "Request Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Retry",
            });
        }


    };

    useEffect(() => {
        const fetchCarMakes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/home/car_model_variant_list/`);
                setCarModelVariant(response.data);
            } catch (error) {
                console.error('Error fetching car makes:', error);
            }
        };

        fetchCarMakes();
    }, []);

    const handleCarVariantChange = async (e) => {
        const variantId = parseInt(e.target.value);
        setFormData((formData) => ({
            ...formData,
            carVariantId: variantId,
        }));
        setcarPartCat([]);
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car_variant_category/${variantId}/`);
            setcarPartCat(response.data);

        } catch (error) {
            console.error("Error fetching car models:", error);
            setcarPartCat([]);
        }
    };

    // Handle Add Part Selection
    const handleAddPartGroupSelection = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("section", partGrouponData.partcat);
        formData.append("name", partGrouponData.name);
        formData.append("image", partGrouponData.image);
        formData.append("status", "active");

        try {
            debugger;
            const response = await axios.post(`${API_BASE_URL}api/home/create_car_part_group_item/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            Swal.fire({
                title: "success created car group",
                text: response.data.message,
                icon: "success",
                confirmButtonText: "OK",
            });

            setShowPartGroupModal(false);
            setPartGroupData({ partSection: '', name: '', image: '' });

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            Swal.fire({
                title: "Request Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Retry",
            });
        }


    };


    const handleCarcategorytChange = async (e) => {
        const partcatId = parseInt(e.target.value);
        setFormData((formData) => ({
            ...formData,
            partCategoryId: partcatId,
        }));
        setcarPartgroupItem([])
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/part_groups_list/${partcatId}/`);
            setcarPartgroupItem(response.data);

        } catch (error) {
            console.error("Error fetching car models:", error);
            setcarPartgroupItem([])
        }
    };

    const handleCarpartitemChange = async (e) => {
        const partitemId = parseInt(e.target.value);
        setFormData((formData) => ({
            ...formData,
            partId: partitemId,
        }));
    }

    // Handle Part Compatibility
    const handleChange = (selectedOptions) => {
    console.log("\n🔄 Compatibility Selection Changed:");
    console.log("Selected Options:", selectedOptions);
    console.log("Type:", typeof selectedOptions);
    console.log("Is Array:", Array.isArray(selectedOptions));
    
    if (selectedOptions && selectedOptions.length > 0) {
        console.log("First item:", selectedOptions[0]);
        console.log("Has 'value':", 'value' in selectedOptions[0]);
        console.log("Has 'label':", 'label' in selectedOptions[0]);
    }
    
    setSelectedParts(selectedOptions);
    setFormData((formData) => ({
        ...formData,
        compatibility: selectedOptions || [],
    }));
    
    console.log("✅ Updated formData.compatibility:", selectedOptions);
    console.log("\n");
};


    const carOptions = carMakes.map(make => ({
        value: make.id,
        label: make.name
      }));
      

// this code for poup model - car varient 
    const [carVariantModel, setModelVariantModel] = useState([]);
    const [carModelPoupData, setModelPoupVarientData] = useState([]);
    const [carcatGroups, setModelPoupVarient] = useState([]);

    const handlecarmodelchange_model = async (e) => {
        const makeId = parseInt(e.target.value);
       try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-models/${makeId}/`);
            setModelVariantModel(response.data);

        } catch (error) {
            console.error("Error fetching car models:", error);
        }
    }

    const handlecarmodelbrandchange_model = async (e) => {
        const varientID = parseInt(e.target.value);
       try {
            const response = await axios.get(`${API_BASE_URL}api/home/car_variant/${varientID}/`);
            setModelPoupVarientData(response.data);

        } catch (error) {
            console.error("Error fetching car models:", error);
        }
    }

    const handlecarvarient_groupchange_model = async (e) => {
        const varientID = parseInt(e.target.value);
       try {
            const response = await axios.get(`${API_BASE_URL}api/home/car_variant_category/${varientID}/`);
            setModelPoupVarient(response.data);

        } catch (error) {
            console.error("Error fetching car models:", error);
        }
    }



    return (
        <div className="col-lg-12">
            <div className="card">
                <div className="card-header">
                    {/* <h5 className="card-title mb-0">Add Products</h5> */}
                    <BulkProductUpload />
                </div>
                <div className="card-body">
                    <form className="row gy-3 needs-validation input-style" noValidate onSubmit={handleSubmit}>
                        {/* Car Brand Selection */}
                       <div className="col-md-4">
    <label className="form-label fw-semibold">
        Select Car <span className="text-danger">*</span>
    </label>

    <div className="d-flex align-items-center ">
        <div className="flex-grow-1 addproduct-select search-select">
            <Select
                className="basic-single "
                classNamePrefix="select"
                options={carMakes.map(make => ({
                    value: make.id,
                    label: make.name,
                }))}
                onChange={(selectedOption) =>
                    handleCarMakeChange({ target: { value: selectedOption.value } })
                }
                placeholder=" Select Car"
                isSearchable={true}
                styles={{
 
    valueContainer: (base) => ({
      ...base,
      height: "50px",
      
    }),
    input: (base) => ({
      ...base,
      height: "40px",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "40px",
    }),
  }}
            />
        </div>

        <button
            type="button"
            className="input-group-text bg-theme-button gap-1 Add-car-top-gap"
            onClick={() => setShowModal(true)}
        >
            <Icon icon="lucide:plus" />
            Add Car
        </button>
    </div>
</div>

                        {/* Car Model Selection */}
                        <div className="col-md-4">
                            <label className="form-label">Select Car Model <span className="text-danger">*</span></label>
                            <div className="addproduct-select input-group has-validation">
                                <select className="form-select form-select input-g" onChange={handleCarModelChange} required>
                                    
                                    <option value="">-- select car model --</option>
                                    {carModels.map((model) => (
                                        <option key={model.id} value={model.id}>{model.name}{model.generation}({new Date(model.production_start_date).getFullYear()} - {new Date(model.production_end_date).getFullYear()})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="input-group-text  bg-theme-button gap-1"
                                    onClick={() => setShowCarModelModal(true)}
                                >
                                    <Icon icon="lucide:plus" /> Add Model
                                </button>
                            </div>
                        </div>
                        {/* Car Variant Selection */}
                        <div className="col-md-4">
                            <label className="form-label">Select Car Variant <span className="text-danger">*</span></label>
                            <div className="addproduct-select input-group has-validation">
                                <select className="form-select form-select input-g" onChange={handleCarVariantChange} required>
                                    <option value="">-- select Car Variant --</option>
                                    {carVariant.map((varient) => (
                                        <option key={varient.id} value={varient.id}>{varient.car_model_name}-{varient.name}({new Date(varient.production_start_date).getFullYear()} - {new Date(varient.production_end_date).getFullYear()})</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="input-group-text bg-theme-button gap-1"
                                    onClick={() => setShowCarVariantModal(true)}
                                >
                                    <Icon icon="lucide:plus" /> Add Variant
                                </button>
                            </div>
                        </div>

                        {/* Part Selection */}
                        <div className="col-md-4">
                            <label className="form-label">Select Part category <span className="text-danger">*</span></label>
                            <div className="addproduct-select input-group has-validation">
                                <select className="form-select form-select input-g" onChange={handleCarcategorytChange} required>
                                    <option value="">-- select car  part category --  </option>
                                    {carPartCat.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}

                                </select>
                                <button
                                    type="button"
                                    className="input-group-text  bg-theme-button gap-1"
                                    onClick={() => setShowPartSelectionCatModal(true)}
                                >
                                    <Icon icon="lucide:plus" /> Add Part
                                </button>
                            </div>
                        </div>

                        {/* Part */}
                        <div className="col-md-4">
                            <label className="form-label">Select Part <span className="text-danger">*</span></label>
                            <div className="addproduct-select input-group has-validation">
                                <select className="form-select form-select input-g" onChange={handleCarpartitemChange} required>
                                    <option value="">-- select car  part  --  </option>
                                    {carcatGroup.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}

                                </select>
                                <button
                                    type="button"
                                    className="input-group-text bg-theme-button gap-1"
                                    onClick={() => setShowPartGroupModal(true)}
                                >
                                    <Icon icon="lucide:plus" /> Add Part
                                </button>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Part Name <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="#0"
                                className="form-control"
                                placeholder="Enter part name,"
                                onChange={(e) =>
                                    setFormData({ ...formData, partName: e.target.value })
                                }
                                required
                            />

                            <div className="invalid-feedback">Please enter part name</div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Part Number <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="#0"
                                className="form-control"
                                placeholder="Enter part number,"
                                onChange={(e) =>
                                    setFormData({ ...formData, partNumber: e.target.value })
                                }
                                required
                            />
                            <div className="invalid-feedback">Please enter part number</div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Part figure Number <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="#0"
                                className="form-control"
                                placeholder="Enter figure no,"
                                onChange={(e) =>
                                    setFormData({ ...formData, figureNumber: e.target.value })
                                }
                                required
                            />
                            <div className="invalid-feedback">Please enter figure number</div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Price<span className="text-danger">*</span></label>
                            <input
                                type="number"
                                name="#0"
                                className="form-control"
                                placeholder="Enter part price,"
                                onChange={(e) =>
                                    setFormData({ ...formData, price: e.target.value })
                                }
                            />
                            <div className="invalid-feedback">Please enter part price</div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Sale Price <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                name="#0"
                                className="form-control"
                                placeholder="Enter part sale price"
                                onChange={(e) =>
                                    setFormData({ ...formData, salePrice: e.target.value })
                                }
                                required
                            />
                            <div className="invalid-feedback">Please enter part sale price</div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Part discount</label>
                            <input
                                type="number"
                                name="#0"
                                className="form-control"
                                placeholder="Enter discount"
                                onChange={(e) =>
                                    setFormData({ ...formData, discount: e.target.value })
                                }
                            />
                            <div className="invalid-feedback">Please enter discount.</div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Part QTY <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                name="#0"
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
                            <label className="form-label">Part SKU <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="#0"
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
                            <label className="form-label">HSN <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                name="#0"
                                className="form-control"
                                placeholder="Enter HSN code"
                                onChange={(e) =>
                                    setFormData({ ...formData, remarks: e.target.value })
                                }
                                required
                            />
                            <div className="invalid-feedback">Please enter HSN code</div>
                        </div>
                        {/* Part Compatibility */}
                        <div className="col-md-6">
                            <label className="form-label">Part Compatibility</label>
                            <div className="input-group">
                                <Select
                                    options={partOptions}
                                    isMulti
                                    onChange={handleChange}
                                    className="w-100 multi-select2"
                                />
                            </div>
                        </div>

                        <div className="col-lg-6 was-validated">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" rows="4" cols="50" placeholder="Enter a description..."
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }>
                            </textarea>
                            <div className="invalid-feedback">Please enter a message in the textarea.</div>
                        </div>


                        <div className="col-12">
                            <button className="btn-theme-admin btn-primary-600 style2" style={{ position: "unset" }} type="submit">
                            Add Car Part
                            </button>
                        </div>
                    </form>

                </div>
            </div>

            {/* Modal for Adding Car Brand */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Car</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}>
                                    X
                                </button>
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
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary style2">
                                        Save Car
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Adding Car Model */}
            {showCarModelModal && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Car Model</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCarModelModal(false)}>
                                    X
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddCarModel} className="input-style">

                                    <div className="mb-3">
                                        <label className="form-label">Select Car</label>
                                        <select
                                            className="form-select"
                                            value={carModelData.car}
                                            onChange={(e) =>
                                                setCarModelData({ ...carModelData, car: e.target.value })
                                            }
                                            required
                                        >
                                            <option value=""> -- Select Car Brand-- </option>
                                            {carMakes.map((make) => (
                                                <option key={make.id} value={make.id}>{make.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Model Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={carModelData.modelName}
                                            onChange={(e) =>
                                                setCarModelData({ ...carModelData, modelName: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Body Type</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={carModelData.bodyType}
                                            onChange={(e) =>
                                                setCarModelData({ ...carModelData, bodyType: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Generation</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={carModelData.generation}
                                            onChange={(e) =>
                                                setCarModelData({ ...carModelData, generation: e.target.value })
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
                                                value={carModelData.MproductionStart}
                                                onChange={(e) =>
                                                    setCarModelData({ ...carModelData, MproductionStart: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Production End</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={carVariantData.MproductionEnd}
                                                onChange={(e) =>
                                                    setCarModelData({ ...carModelData, MproductionEnd: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Fuel Type</label>
                                        <select
                                            className="form-select"
                                            value={carModelData.fuelType}
                                            onChange={(e) =>
                                                setCarModelData({ ...carModelData, fuelType: e.target.value })
                                            }
                                            required
                                        >
                                            <option value="">Select Fuel Type</option>
                                            <option value="petrol">Petrol</option>
                                            <option value="diesel">Diesel</option>
                                            <option value="electric">Electric</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Upload Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) =>
                                                setCarModelData({ ...carModelData, image: e.target.files[0] })
                                            }
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary style2">
                                        Save Model
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Adding Car Variant */}
            {showCarVariantModal && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Car Variant</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCarVariantModal(false)}>
                                    X
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddCarVariant} className="input-style">

                                    <div className="mb-3">
                                        <label className="form-label">Select Car</label>
                                        <select
                                            className="form-select"
                                            
                                            onChange={(e) => {
                                              
                                                handlecarmodelchange_model({ target: { value: e.target.value } });
                                            }}
                                      
                                        >
                                            <option value=""> -- Select Car Brand-- </option>
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
                                            <option value="">Select Model</option>
                                            {carVariantModel.map((model) => (
                                                <option key={model.id} value={model.id}>{model.name}{model.generation}({new Date(model.production_start_date).getFullYear()} - {new Date(model.production_end_date).getFullYear()})
                                                </option>
                                            ))}
                                            {/* {carModelList.map((model) => (
                                                <option value={model.id}>{model.name}{model.generation}</option>
                                            ))} */}


                                        </select>
                                    </div>


                                    <div className="mb-3">
                                        <label className="form-label">Variant Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder='enter variant name '
                                            value={carVariantData.name}
                                            onChange={(e) =>
                                                setCarVariantData({ ...carVariantData, name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    {/* <div className="mb-3">
                                        <label className="form-label">Region</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder='enter regian' 
                                            value={carVariantData.region}
                                            onChange={(e) =>
                                                setCarVariantData({ ...carVariantData, region: e.target.value })
                                            }
                                            required
                                        />
                                    </div> */}
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
                                                placeholder='enter chassis Type'
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
                                                placeholder='enter engine type'
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
                                            placeholder='enter description ....'
                                            value={carVariantData.description}
                                            onChange={(e) =>
                                                setCarVariantData({ ...carVariantData, description: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary style2">
                                        Save Variant
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Adding Part Selection */}
            {showPartSelectionCatModal && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Part Selection</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPartSelectionCatModal(false)}>
                                    X
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddPartSelection} className="input-style">

                                    <div className="mb-3">
                                        <label className="form-label">Select Car</label>
                                        <select
                                            className="form-select"
                                            onChange={(e) => {
                                              
                                                handlecarmodelchange_model({ target: { value: e.target.value } });
                                            }}
                                         
                                        >
                                            <option value=""> -- Select Car Brand-- </option>
                                            {carMakes.map((make) => (
                                                <option key={make.id} value={make.id}>{make.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Select Car Model</label>
                                        <select
                                            className="form-select"
                                            onChange={(e) => {
                                              
                                                handlecarmodelbrandchange_model({ target: { value: e.target.value } });
                                            }}
                                        >
                                            <option value="">Select Model</option>
                                            {carVariantModel.map((model) => (
                                                <option key={model.id} value={model.id}>{model.name}{model.generation}({new Date(model.production_start_date).getFullYear()} - {new Date(model.production_end_date).getFullYear()})
                                                </option>
                                            ))}
                                            {/* {carModelList.map((model) => (
                                                <option value={model.id}>{model.name}{model.generation}</option>
                                            ))} */}


                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Select Car Variant</label>
                                        <select
                                            className="form-select"
                                            onChange={(e) =>
                                                setPartSelectionData({ ...partSelectionData, carVariant: e.target.value })
                                            }
                                            required
                                        >
                                            <option value="">-- Select Variant -- </option>
                                            {/* {carVariant.map((varient) => (
                                        <option value={varient.id}>{varient.name}({new Date(varient.production_start_date).getFullYear()} - {new Date(varient.production_end_date).getFullYear()})</option>
                                    ))} */}
                                            
                                            {carModelPoupData.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                             
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Part category Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={partSelectionData.name}
                                            onChange={(e) =>
                                                setPartSelectionData({ ...partSelectionData, name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Upload Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) =>
                                                setPartSelectionData({ ...partSelectionData, image: e.target.files[0] })
                                            }
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary style2">
                                        Save Part
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal for Adding Part Group */}
            {showPartGroupModal && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Part Group</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPartGroupModal(false)}>
                                    X
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddPartGroupSelection} className="input-style">
                                      <div className="mb-3">
                                        <label className="form-label">Select Car</label>
                                        <select
                                            className="form-select"
                                            onChange={(e) => {
                                              
                                                handlecarmodelchange_model({ target: { value: e.target.value } });
                                            }}
                                         
                                        >
                                            <option value=""> -- Select Car Brand-- </option>
                                            {carMakes.map((make) => (
                                                <option key={make.id} value={make.id}>{make.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Select Car Model</label>
                                        <select
                                            className="form-select"
                                            onChange={(e) => {
                                              
                                                handlecarmodelbrandchange_model({ target: { value: e.target.value } });
                                            }}
                                        >
                                            <option value="">Select Model</option>
                                            {carVariantModel.map((model) => (
                                                <option key={model.id} value={model.id}>{model.name}{model.generation}({new Date(model.production_start_date).getFullYear()} - {new Date(model.production_end_date).getFullYear()})
                                                </option>
                                            ))}
                                            
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Select Car Variant</label>
                                        <select
                                            className="form-select"
                                            onChange={(e) => {
                                              
                                                handlecarvarient_groupchange_model({ target: { value: e.target.value } });
                                            }}
                                            required
                                        >
                                            <option value="">-- Select Variant -- </option>
                                            {/* {carVariant.map((varient) => (
                                        <option value={varient.id}>{varient.name}({new Date(varient.production_start_date).getFullYear()} - {new Date(varient.production_end_date).getFullYear()})</option>
                                    ))} */}
                                            
                                            {carModelPoupData.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                             
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Select Part Category</label>
                                        <select
                                            className="form-select"
                                            value={partGrouponData.partcat}
                                            onChange={(e) =>
                                                setPartGroupData({ ...partGrouponData, partcat: e.target.value })
                                            }
                                            required
                                        >
                                            <option value="">-- Select Part Category -- </option>
                                            {carcatGroups.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Part category Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={partGrouponData.name}
                                            onChange={(e) =>
                                                setPartGroupData({ ...partGrouponData, name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Upload Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) =>
                                                setPartGroupData({ ...partGrouponData, image: e.target.files[0] })
                                            }
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary style2">
                                        Save Part Group
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Part Compatibility (if needed, similar logic) */}
            {showPartCompatibilityModal && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Part Compatibility</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPartCompatibilityModal(false)}>
                                    X
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Add your multi-selection logic for compatibility */}
                                <p>Please implement compatibility multi-section logic here.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddProductsForm;