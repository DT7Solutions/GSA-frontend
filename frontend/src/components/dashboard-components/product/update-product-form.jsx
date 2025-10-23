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


    // Handle save product
    const [formData, setFormData] = useState({
        carMakeId: '',
        carModelId: '',
        carVariantId: '',
        partCategoryId: '',
        partId: '',
        partName : '',
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
                const response =  await axios.get(`${API_BASE_URL}api/home/car-models/${makeId}/`);
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
        setFormData(prevFormData => ({ ...prevFormData, car_make_id: selectedOption?.value || '' })); // Updated key
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
        setFormData(prevFormData => ({ ...prevFormData, car_model_id: selectedOption?.value || '' })); // Updated key
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
        setFormData(prevFormData => ({ ...prevFormData, car_variant_id: selectedOption?.value || '' })); // Updated key
        setSelectedPartCategory(null);
        setPartCategories([]);
        setSelectedPartGroup(null);
        setPartGroups([]);
        fetchPartCategoriesList(selectedOption?.value);
    };

    const handlePartCategoryChange = (selectedOption) => {
        setSelectedPartCategory(selectedOption);
        setFormData(prevFormData => ({ ...prevFormData, part_section_id: selectedOption?.value || '' })); // Updated key
        setSelectedPartGroup(null);
        setPartGroups([]);
        fetchPartGroupsList(selectedOption?.value);
    };

    const handlePartGroupChange = (selectedOption) => {
        setSelectedPartGroup(selectedOption);
        setFormData(prevFormData => ({ ...prevFormData, part_group_id: selectedOption?.value || '' })); // Updated key
    };


    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}api/home/car-parts-list/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                debugger;
                const data = response.data;
                
                setFormData({
                    car_make_id: data.car_make?.id || '', 
                    car_model_id: data.car_model?.id || '', 
                    car_variant_id: data.car_variant?.id || '', 
                    part_section_id: data.part_section?.id || '', 
                    part_group_id: data.part_group?.id || '', 
                    partName : data.product_name || '',   
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

                fetchCarMakesList();
                const makeId = data.car_make?.id;
                if (makeId) {
                    setSelectedCarMake({ value: makeId, label: data.car_make.name });
                    fetchCarModelsList(makeId);
                    const modelId = data.car_model?.id;
                    if (modelId) {
                        setSelectedCarModel({ value: modelId, label: data.car_model.name });
                        fetchCarVariantsList(modelId);
                        const variantId = data.car_variant?.id;
                        
                        if (variantId) {
                            setSelectedCarVariant({ value: variantId, label: data.car_variant.name });
                            fetchPartCategoriesList(variantId);
                            const categoryId = data.part_group?.section;
                            if (categoryId) {
                                setSelectedPartCategory({ value: categoryId, label: data.part_section.name });
                                fetchPartGroupsList(categoryId);
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

        fetchProductData();
    }, [id, token]);


    // Handle final product update logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            debugger;
            const response = await axios.put(`${API_BASE_URL}api/home/car-parts-list/${id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            Swal.fire({
                title: "Success Updated Car Part Successfully",
                text: response.data.message,
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update part";
            Swal.fire({
                title: "Request Failed",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "Retry",
            });
        }
    };

    const carMakeOptions = carMakes.map(make => ({ value: make.id, label: make.name }));
    const carModelOptions = carModels.map(model => ({ value: model.id, label: `${model.name}-(${new Date(model.production_start_date).getFullYear()} - ${new Date(model.production_end_date).getFullYear()})` }));
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
                            <label className="form-label">Remarks</label>
                            <input
                                type="text"
                                name="#0"
                                value={formData.remarks}
                                className="form-control"
                                placeholder="Enter remarks,"
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                required
                            />
                        </div>
                        {/* Description */}
                        <div className="col-lg-8 was-validated">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" rows="4" cols="50" placeholder="Enter a description..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            >
                            </textarea>
                            <div className="invalid-feedback">Please enter a message in the textarea.</div>
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