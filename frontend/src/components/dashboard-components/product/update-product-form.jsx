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
    const [carVariants, setCarVariants] = useState([]);
    const [partCategories, setPartCategories] = useState([]);
    const [partGroups, setPartGroups] = useState([]);

    const [selectedCarMake, setSelectedCarMake] = useState(null);
    const [selectedCarModel, setSelectedCarModel] = useState(null);
    const [selectedCarVariant, setSelectedCarVariant] = useState(null);
    const [selectedPartCategory, setSelectedPartCategory] = useState(null);
    const [selectedPartGroup, setSelectedPartGroup] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [existingImageUrl, setExistingImageUrl] = useState('');

    // Handle save product
    const [formData, setFormData] = useState({
        car_make_id: '',
        car_model_id: '',
        car_variant_id: '',
        part_section_id: '',
        part_group_id: '',
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

    // Fetch part compatibility options
    useEffect(() => {
        const fetchPartOptions = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/home/car-models/`);
                const options = response.data.map(item => ({
                    value: item.id,
                    label: `${item.name}  (${item.production_start_date} - ${item.production_end_date})`
                }));
                setPartOptions(options);
            } catch (error) {
                console.error('Error fetching part options:', error);
            }
        };
        fetchPartOptions();
    }, []);

    const fetchCarMakesList = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}api/home/car-makes/`);
            setCarMakes(response.data);
        } catch (error) {
            console.error('Error fetching car makes:', error);
        }
    };

    const fetchCarModelsList = async (makeId) => {
        if (makeId) {
            try {
                const response = await axios.get(`${API_BASE_URL}api/home/car-models/${makeId}/`);
                setCarModels(response.data);
            } catch (error) {
                console.error('Error fetching car models:', error);
                setCarModels([]);
            }
        } else {
            setCarModels([]);
        }
    };

    const fetchCarVariantsList = async (modelId) => {
        if (modelId) {
            try {
                const response = await axios.get(`${API_BASE_URL}api/home/car_variant/${modelId}/`);
                setCarVariants(response.data);
            } catch (error) {
                console.error('Error fetching car variants:', error);
                setCarVariants([]);
            }
        } else {
            setCarVariants([]);
        }
    };

    const fetchPartCategoriesList = async (variantId) => {
        if (variantId) {
            try {
                const response = await axios.get(`${API_BASE_URL}api/home/car_variant_category/${variantId}/`);
                setPartCategories(response.data);
            } catch (error) {
                console.error('Error fetching part categories:', error);
                setPartCategories([]);
            }
        } else {
            setPartCategories([]);
        }
    };

    const fetchPartGroupsList = async (categoryId) => {
        if (categoryId) {
            try {
                const response = await axios.get(`${API_BASE_URL}api/home/part_groups_list/${categoryId}/`);
                setPartGroups(response.data);
            } catch (error) {
                console.error('Error fetching part groups:', error);
                setPartGroups([]);
            }
        } else {
            setPartGroups([]);
        }
    };

    const handleCarMakeChange = (selectedOption) => {
        setSelectedCarMake(selectedOption);
        setFormData(prevFormData => ({ ...prevFormData, car_make_id: selectedOption?.value || '' }));
        setSelectedCarModel(null);
        setCarModels([]);
        setSelectedCarVariant(null);
        setCarVariants([]);
        setSelectedPartCategory(null);
        setPartCategories([]);
        setSelectedPartGroup(null);
        setPartGroups([]);
        fetchCarModelsList(selectedOption?.value);
    };

    const handleCarModelChange = (selectedOption) => {
        setSelectedCarModel(selectedOption);
        setFormData(prevFormData => ({ ...prevFormData, car_model_id: selectedOption?.value || '' }));
        setSelectedCarVariant(null);
        setCarVariants([]);
        setSelectedPartCategory(null);
        setPartCategories([]);
        setSelectedPartGroup(null);
        setPartGroups([]);
        fetchCarVariantsList(selectedOption?.value);
    };

    const handleCarVariantChange = (selectedOption) => {
        setSelectedCarVariant(selectedOption);
        setFormData(prevFormData => ({ ...prevFormData, car_variant_id: selectedOption?.value || '' }));
        setSelectedPartCategory(null);
        setPartCategories([]);
        setSelectedPartGroup(null);
        setPartGroups([]);
        fetchPartCategoriesList(selectedOption?.value);
    };

    const handlePartCategoryChange = (selectedOption) => {
        setSelectedPartCategory(selectedOption);
        setFormData(prevFormData => ({ ...prevFormData, part_section_id: selectedOption?.value || '' }));
        setSelectedPartGroup(null);
        setPartGroups([]);
        fetchPartGroupsList(selectedOption?.value);
    };

    const handlePartGroupChange = (selectedOption) => {
        setSelectedPartGroup(selectedOption);
        setFormData(prevFormData => ({ ...prevFormData, part_group_id: selectedOption?.value || '' }));
    };

    // Handle Part Compatibility Change
    const handleCompatibilityChange = (selectedOptions) => {
        setSelectedParts(selectedOptions || []);
        setFormData((prevFormData) => ({
            ...prevFormData,
            compatibility: selectedOptions || [],
        }));
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

                console.log("📦 Product Data:", data);
                console.log("🔗 Compatibility Data:", data.compatibilities);

                setFormData({
                    car_make_id: data.car_make?.id || '',
                    car_model_id: data.car_model?.id || '',
                    car_variant_id: data.car_variant?.id || '',
                    part_section_id: data.part_section?.id || '',
                    part_group_id: data.part_group?.id || '',
                    partName: data.product_name || '',
                    partNumber: data.part_no || '',
                    figureNumber: data.fig_no || '',
                    price: data.price || '',
                    salePrice: data.sale_price || '',
                    discount: data.discount || '',
                    qty: data.qty || '',
                    sku: data.sku || '',
                    remarks: data.remarks || '',
                    compatibility: data.compatibilities || [],
                    description: data.description || '',
                });

                setPreviewImage(data.product_image || '');
                setExistingImageUrl(data.product_image || '');
                
                // Fetch car makes first
                await fetchCarMakesList();

                // ✅ FIXED: Process compatibility data from the serializer
                if (data.compatibilities && Array.isArray(data.compatibilities) && data.compatibilities.length > 0) {
                    console.log("🔍 Processing compatibility data from API...");
                    
                    // Map the compatibility objects returned from the serializer
                    // The serializer returns: compatible_model_id, compatible_model_name, generation, production_years
                    const compatibilityOptions = data.compatibilities.map(comp => {
                        const id = comp.compatible_model_id;
                        const name = comp.compatible_model_name;
                        const generation = comp.generation || '';
                        const years = comp.production_years || '';
                        
                        return {
                            value: id,
                            label: `${name} (${generation}) ${years ? `(${years})` : ''}`
                        };
                    });
                    
                    console.log("✅ Mapped compatibility options:", compatibilityOptions);
                    setSelectedParts(compatibilityOptions);
                } else {
                    console.log("ℹ️ No compatibility data");
                    setSelectedParts([]);
                }

                const makeId = data.car_make?.id;
                if (makeId) {
                    setSelectedCarMake({ value: makeId, label: data.car_make.name });
                    await fetchCarModelsList(makeId);
                    
                    const modelId = data.car_model?.id;
                    if (modelId) {
                        // Handle both date string and year string formats
                        let startYear = '';
                        let endYear = '';
                        
                        try {
                            // If it's a date string like "2020-01-01"
                            if (data.car_model.production_start_date.includes('-') && data.car_model.production_start_date.length > 4) {
                                startYear = new Date(data.car_model.production_start_date).getFullYear();
                            } else {
                                // If it's a year string like "2020"
                                startYear = data.car_model.production_start_date;
                            }
                            
                            if (data.car_model.production_end_date.includes('-') && data.car_model.production_end_date.length > 4) {
                                endYear = new Date(data.car_model.production_end_date).getFullYear();
                            } else {
                                endYear = data.car_model.production_end_date;
                            }
                        } catch (e) {
                            console.error("Error parsing dates:", e);
                            startYear = data.car_model.production_start_date;
                            endYear = data.car_model.production_end_date;
                        }
                        
                        setSelectedCarModel({ 
                            value: modelId, 
                            label: `${data.car_model.name}-(${startYear} - ${endYear})` 
                        });
                        await fetchCarVariantsList(modelId);
                        
                        const variantId = data.car_variant?.id;
                        if (variantId) {
                            setSelectedCarVariant({ value: variantId, label: data.car_variant.name });
                            await fetchPartCategoriesList(variantId);
                            
                            const categoryId = data.part_section?.id;
                            if (categoryId) {
                                setSelectedPartCategory({ value: categoryId, label: data.part_section.name });
                                await fetchPartGroupsList(categoryId);
                                
                                const groupId = data.part_group?.id;
                                if (groupId) {
                                    setSelectedPartGroup({ value: groupId, label: data.part_group.name });
                                }
                            }
                        }
                    }
                }

            } catch (error) {
                console.error("Error fetching product data:", error);
                Swal.fire({
                    title: "Failed to fetch product data",
                    text: error.message,
                    icon: "error",
                });
            }
        };

        if (id && token) {
            fetchProductData();
        }
    }, [id, token]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = new FormData();

            payload.append('car_make_id', formData.car_make_id);
            payload.append('car_model_id', formData.car_model_id);
            payload.append('car_variant_id', formData.car_variant_id);
            payload.append('part_section_id', formData.part_section_id);
            payload.append('part_group_id', formData.part_group_id);
            payload.append('partName', formData.partName);
            payload.append('partNumber', formData.partNumber);
            payload.append('figureNumber', formData.figureNumber);
            payload.append('price', formData.price);
            payload.append('salePrice', formData.salePrice);
            payload.append('discount', formData.discount);
            payload.append('qty', formData.qty);
            payload.append('sku', formData.sku);
            payload.append('remarks', formData.remarks);
            payload.append('description', formData.description);

            // Add compatibility data - send as array of IDs
            if (selectedParts && selectedParts.length > 0) {
                const compatibilityIds = selectedParts.map(item => item.value);
                payload.append('compatibility', JSON.stringify(compatibilityIds));
            } else {
                payload.append('compatibility', JSON.stringify([]));
            }

            if (formData.partImage && formData.partImage instanceof File) {
                payload.append('partImage', formData.partImage);
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            };

            const response = await axios.put(
                `${API_BASE_URL}api/home/car-parts-list/${id}/`,
                payload,
                { headers }
            );

            if (response.status === 200) {
                Swal.fire({
                    title: "Success",
                    text: "Car part updated successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error("Backend error:", error.response);

            const errorData = error.response?.data;
            let errorMessage = "Failed to update part";

            if (errorData) {
                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.errors) {
                    errorMessage = Object.entries(errorData.errors)
                        .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
                        .join("\n");
                } else {
                    errorMessage = JSON.stringify(errorData);
                }
            }

            Swal.fire({
                title: "Request Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Retry",
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, partImage: file });
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, partImage: '' });
        setPreviewImage(existingImageUrl);
        const fileInput = document.querySelector('input[name="partImage"]');
        if (fileInput) fileInput.value = '';
    };

    const carMakeOptions = carMakes.map(make => ({ value: make.id, label: make.name }));
    const carModelOptions = carModels.map(model => ({ 
        value: model.id, 
        label: `${model.name}-(${new Date(model.production_start_date).getFullYear()} - ${new Date(model.production_end_date).getFullYear()})` 
    }));
    const carVariantOptions = carVariants.map(variant => ({ value: variant.id, label: variant.name }));
    const partCategoryOptions = partCategories.map(category => ({ value: category.id, label: category.name }));
    const partGroupOptions = partGroups.map(group => ({ value: group.id, label: group.name }));

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
                            <label className="form-label">Select Car Brand</label>
                            <div className="input-group has-validation">
                                <div className='search-select'>
                                    <Select
                                        className="basic-single input-g"
                                        classNamePrefix="select"
                                        options={carMakeOptions}
                                        value={selectedCarMake}
                                        onChange={handleCarMakeChange}
                                        placeholder="-- Select Car Brand --"
                                        isSearchable={true}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Car Model Selection */}
                        <div className="col-md-4">
                            <label className="form-label">Select Car Model</label>
                            <div className="input-group has-validation">
                                <div className='search-select'>
                                    <Select
                                        className="basic-single input-g"
                                        classNamePrefix="select"
                                        options={carModelOptions}
                                        value={selectedCarModel}
                                        onChange={handleCarModelChange}
                                        placeholder="-- Select Car Model --"
                                        isSearchable={true}
                                        isDisabled={!selectedCarMake}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Car Variant Selection */}
                        <div className="col-md-4">
                            <label className="form-label">Select Car Variant</label>
                            <div className="input-group has-validation">
                                <div className='search-select'>
                                    <Select
                                        className="basic-single input-g"
                                        classNamePrefix="select"
                                        options={carVariantOptions}
                                        value={selectedCarVariant}
                                        onChange={handleCarVariantChange}
                                        placeholder="-- Select Car Variant --"
                                        isSearchable={true}
                                        isDisabled={!selectedCarModel}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Part Category Selection */}
                        <div className="col-md-4">
                            <label className="form-label">Select Part Category</label>
                            <div className="input-group has-validation">
                                <div className='search-select'>
                                    <Select
                                        className="basic-single input-g"
                                        classNamePrefix="select"
                                        options={partCategoryOptions}
                                        value={selectedPartCategory}
                                        onChange={handlePartCategoryChange}
                                        placeholder="-- Select Part Category --"
                                        isSearchable={true}
                                        isDisabled={!selectedCarVariant}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Part Group Selection */}
                        <div className="col-md-4">
                            <label className="form-label">Select Part Group</label>
                            <div className="input-group has-validation">
                                <div className='search-select'>
                                    <Select
                                        className="basic-single input-g"
                                        classNamePrefix="select"
                                        options={partGroupOptions}
                                        value={selectedPartGroup}
                                        onChange={handlePartGroupChange}
                                        placeholder="-- Select Part Group --"
                                        isSearchable={true}
                                        isDisabled={!selectedPartCategory}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Part Name</label>
                            <input
                                type="text"
                                name="partName"
                                className="form-control"
                                placeholder="Enter part name"
                                value={formData.partName}
                                onChange={(e) =>
                                    setFormData({ ...formData, partName: e.target.value })
                                }
                                required
                            />
                            <div className="invalid-feedback">Please enter part name.</div>
                        </div>

                        {/* <div className="col-md-4">
                            <label className="form-label">Part Image</label>
                            <input
                                type="file"
                                name="partImage"
                                className="form-control"
                                onChange={handleImageChange}
                                accept="image/*"
                            />

                            {previewImage && (
                                <div className="mt-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <p className="mb-0 text-muted small">
                                            {formData.partImage instanceof File ? "New Image Preview:" : "Current Image:"}
                                        </p>
                                        {formData.partImage instanceof File && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={handleRemoveImage}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="position-relative" style={{ width: "120px" }}>
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                borderRadius: "8px",
                                                border: "2px solid #e0e0e0",
                                                objectFit: "cover",
                                            }}
                                        />
                                        {formData.partImage instanceof File && (
                                            <span
                                                className="badge bg-success position-absolute top-0 end-0 m-1"
                                                style={{ fontSize: "10px" }}
                                            >
                                                New
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="invalid-feedback">Please select a valid image file.</div>
                        </div> */}

                        {/* Part Number */}
                        <div className="col-md-4">
                            <label className="form-label">Part Number</label>
                            <input
                                type="text"
                                name="#0"
                                className="form-control"
                                value={formData.partNumber}
                                placeholder="Enter part number,"
                                onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                                required
                                disabled
                            />
                            <div className="invalid-feedback">Please part number</div>
                        </div>

                        {/* Figure Number */}
                        <div className="col-md-4">
                            <label className="form-label">Part Figure Number</label>
                            <input
                                type="text"
                                name="#0"
                                value={formData.figureNumber}
                                className="form-control"
                                placeholder="Enter figure no,"
                                onChange={(e) => setFormData({ ...formData, figureNumber: e.target.value })}
                                required
                            />
                            <div className="invalid-feedback">Please figure number</div>
                        </div>

                        {/* Price */}
                        <div className="col-md-4">
                            <label className="form-label">Price</label>
                            <input
                                type="number"
                                name="#0"
                                value={formData.price}
                                className="form-control"
                                placeholder="Enter part price,"
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                            <div className="invalid-feedback">Please part price</div>
                        </div>

                        {/* Sale Price */}
                        <div className="col-md-4">
                            <label className="form-label">Sale Price</label>
                            <input
                                type="number"
                                name="#0"
                                value={formData.salePrice}
                                className="form-control"
                                placeholder="Enter part sale price"
                                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                                required
                            />
                            <div className="invalid-feedback">Please part sale price</div>
                        </div>

                        {/* Discount */}
                        <div className="col-md-4">
                            <label className="form-label">Part discount</label>
                            <input
                                type="number"
                                name="#0"
                                value={formData.discount}
                                className="form-control"
                                placeholder="Enter discount"
                                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                required
                            />
                            <div className="invalid-feedback">Please discount.</div>
                        </div>

                        {/* QTY */}
                        <div className="col-md-4">
                            <label className="form-label">Part QTY</label>
                            <input
                                type="number"
                                name="#0"
                                value={formData.qty}
                                className="form-control"
                                placeholder="Enter number of QTY,"
                                onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                                required
                            />
                            <div className="invalid-feedback">Please provide qty.</div>
                        </div>

                        {/* SKU */}
                        <div className="col-md-4">
                            <label className="form-label">Part SKU</label>
                            <input
                                type="text"
                                name="#0"
                                value={formData.sku}
                                className="form-control"
                                placeholder="Enter number of sku,"
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                required
                            />
                            <div className="invalid-feedback">Please provide sku.</div>
                        </div>

                        {/* Remarks */}
                        <div className="col-md-4">
                            <label className="form-label">HSN</label>
                            <input
                                type="text"
                                name="#0"
                                value={formData.remarks}
                                className="form-control"
                                placeholder="Enter HSN code"
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                required
                            />
                        </div>

                        {/* Part Compatibility */}
                        <div className="col-md-6">
                            <label className="form-label">Part Compatibility</label>
                            <div className="input-group">
                                <Select
                                    options={partOptions}
                                    isMulti
                                    value={selectedParts}
                                    onChange={handleCompatibilityChange}
                                    className="w-100 multi-select2"
                                    placeholder="Select compatible car models"
                                />
                            </div>
                            <small className="text-muted">
                                {selectedParts.length > 0 ? `${selectedParts.length} model(s) selected` : 'No models selected'}
                            </small>
                        </div>

                        {/* Description */}
                        <div className="col-lg-6 was-validated">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" rows="4" cols="50" placeholder="Enter a description..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            >
                            </textarea>
                            <div className="invalid-feedback">Please enter a message in the textarea.</div>
                        </div>

                        <div className="col-12">
                            <button className="btn-theme-admin" type="submit">
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