import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import Select from 'react-select';

const AddProductsForm = () => {
    const [showModal, setShowModal] = useState(false);
    const [showCarModelModal, setShowCarModelModal] = useState(false);
    const [showCarVariantModal, setShowCarVariantModal] = useState(false);
    const [showPartSelectionModal, setShowPartSelectionModal] = useState(false);
    const [showPartCompatibilityModal, setShowPartCompatibilityModal] = useState(false);
    const [selectedParts, setSelectedParts] = useState([]);


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
    });

    // Handle Add Car (Brand)
    const handleAddCar = (e) => {
        e.preventDefault();
        console.log('Car Brand Data:', carBrandData);
        setShowModal(false);
        setCarBrandData({ brandname: '', image: null });
    };

    // Handle Add Car Model
    const handleAddCarModel = (e) => {
        e.preventDefault();
        console.log('Car Model Data:', carModelData);
        setShowCarModelModal(false);
        setCarModelData({ car: '', modelName: '', bodyType: '', fuelType: '', image: null });
    };

    // Handle Add Car Variant
    const handleAddCarVariant = (e) => {
        e.preventDefault();
        console.log('Car Variant Data:', carVariantData);
        setShowCarVariantModal(false);
        setCarVariantData({
            carModel: '',
            name: '',
            region: '',
            productionStart: '',
            productionEnd: '',
            chassisType: '',
            description: '',
        });
    };

    // Handle Add Part Selection
    const handleAddPartSelection = (e) => {
        e.preventDefault();
        console.log('Part Selection Data:', partSelectionData);
        setShowPartSelectionModal(false);
        setPartSelectionData({ carVariant: '', name: '', partGroup: '' });
    };

    // For Part Compatibility, you might manage it differently since it is a multi-select.
    const partOptions = [
        { value: 'variant1', label: '5DR 1.4 E (DIESEL)(06.2015-05.2018)' },
        { value: 'variant2', label: '5DR 1.5L 6S (DIESEL)(06.2021 -02.2023)' },
    ];

    // Handle Part Compatibility
    const handleChange = (selectedOptions) => {
        setSelectedParts(selectedOptions);
        console.log("Selected Parts:", selectedOptions);
    }

    return (
        <div className="col-lg-12">
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title mb-0">Add Products</h5>
                </div>
                <div className="card-body">
                    <form className="row gy-3 needs-validation input-style" noValidate>
                        {/* Car Brand Selection */}
                        <div className="col-md-4">
                            <label className="form-label">Select Car</label>
                            <div className="input-group has-validation">
                                <select className="form-select form-select input-g">
                                    <option >-- select car --</option>
                                    <option value="hyundai">Hyundai</option>
                                    <option value="kia">Kia</option>
                                    <option value="maruthi">Maruthi Suzuki</option>
                                </select>
                                <button
                                    type="button"
                                    className="input-group-text bg-base"
                                    onClick={() => setShowModal(true)}
                                >
                                    <Icon icon="lucide:plus" /> Add Car
                                </button>
                            </div>
                        </div>

                        {/* Car Model Selection */}
                        <div className="col-md-4">
                            <label className="form-label">Select Car Model</label>
                            <div className="input-group has-validation">
                                <select className="form-select form-select input-g">
                                    <option >-- select car model --</option>
                                    <option value="model1">ALCAZAR 1ST GEN (2021-2023)</option>
                                    <option value="model2">CRETA 1ST GEN (2015-2018)</option>
                                </select>
                                <button
                                    type="button"
                                    className="input-group-text bg-base"
                                    onClick={() => setShowCarModelModal(true)}
                                >
                                    <Icon icon="lucide:plus" /> Add Model
                                </button>
                            </div>
                        </div>

                        {/* Car Variant Selection */}
                        <div className="col-md-4">
                            <label className="form-label">Select Car Variant</label>
                            <div className="input-group has-validation">
                                <select className="form-select form-select input-g">
                                    <option >-- select Car Variant --</option>
                                    <option value="variant1">5DR 1.4 E (DIESEL)(06.2015-05.2018)</option>
                                    <option value="variant2">5DR 1.5L 6S (DIESEL)(06.2021 -02.2023)</option>
                                </select>
                                <button
                                    type="button"
                                    className="input-group-text bg-base"
                                    onClick={() => setShowCarVariantModal(true)}
                                >
                                    <Icon icon="lucide:plus" /> Add Variant
                                </button>
                            </div>
                        </div>

                        {/* Part Selection */}
                        <div className="col-md-4">
                            <label className="form-label">Select Part Type</label>
                            <div className="input-group has-validation">
                                <select className="form-select form-select input-g">
                                    <option >-- select Car  PartGroup --  </option>
                                    <option value="part1">Body</option>
                                    <option value="part2">CHassis</option>
                                    <option value="part2">Electric</option>
                                    <option value="part2">Engine</option>
                                    <option value="part2">Trim</option>
                                    <option value="part2">Transmission</option>
                                </select>
                                <button
                                    type="button"
                                    className="input-group-text bg-base"
                                    onClick={() => setShowPartSelectionModal(true)}
                                >
                                    <Icon icon="lucide:plus" /> Add Part
                                </button>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Part Name</label>
                            <input
                                type="text"
                                name="#0"
                                className="form-control"
                                placeholder="Enter part name,"
                                required
                            />
                            <div className="invalid-feedback">Please part name</div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Part Number</label>
                            <input
                                type="text"
                                name="#0"
                                className="form-control"
                                placeholder="Enter part number,"
                                required
                            />
                            <div className="invalid-feedback">Please part number</div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Part QTY</label>
                            <input
                                type="number"
                                name="#0"
                                className="form-control"
                                placeholder="Enter number of QTY,"
                                required
                            />
                            <div className="invalid-feedback">Please provide qty.</div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Part Image Number</label>
                            <input
                                type="text"
                                name="#0"
                                className="form-control"
                                placeholder="Enter figure no,"
                                required
                            />
                            <div className="invalid-feedback">Please figure number</div>
                        </div>

                        <div class="col-lg-4">
                            <label className="form-label">Upload Image</label>
                            <input
                                type="file"
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Remarks</label>
                            <input
                                type="text"
                                name="#0"
                                className="form-control"
                                placeholder="Enter remarks,"
                                required
                            />
                        </div>



                        {/* Part Compatibility */}
                        <div className="col-md-8">
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

                        <div class="col-lg-8 was-validated">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" rows="4" cols="50" placeholder="Enter a description...">
                            </textarea>
                            <div class="invalid-feedback">Please enter a message in the textarea.</div>
                        </div>

                    
                        <div className="col-12">
                            <button className="btn btn-primary-600 style2" type="submit">
                                Submit form
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
                                            <option value="">Select Car</option>
                                            <option value="hyundai">Hyundai</option>
                                            <option value="kia">Kia</option>
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
                                            <option value="model1">Model 1</option>
                                            <option value="model2">Model 2</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Variant Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={carVariantData.name}
                                            onChange={(e) =>
                                                setCarVariantData({ ...carVariantData, name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Region</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={carVariantData.region}
                                            onChange={(e) =>
                                                setCarVariantData({ ...carVariantData, region: e.target.value })
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
                                    <div className="mb-3">
                                        <label className="form-label">Chassis Type</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={carVariantData.chassisType}
                                            onChange={(e) =>
                                                setCarVariantData({ ...carVariantData, chassisType: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
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
            {showPartSelectionModal && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Part Selection</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPartSelectionModal(false)}>
                                    X
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddPartSelection} className="input-style">
                                    <div className="mb-3">
                                        <label className="form-label">Select Car Variant</label>
                                        <select
                                            className="form-select"
                                            value={partSelectionData.carVariant}
                                            onChange={(e) =>
                                                setPartSelectionData({ ...partSelectionData, carVariant: e.target.value })
                                            }
                                            required
                                        >
                                            <option value="">Select Variant</option>
                                            <option value="variant1">Variant 1</option>
                                            <option value="variant2">Variant 2</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Part Name</label>
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
                                    {/* <div className="mb-3">
                                        <label className="form-label">Part Group</label>
                                        <select
                                            className="form-select"
                                            value={partSelectionData.partGroup}
                                            onChange={(e) =>
                                                setPartSelectionData({ ...partSelectionData, partGroup: e.target.value })
                                            }
                                            required
                                        >
                                            <option value="">Select Group</option>
                                            <option value="engine">Engine</option>
                                            <option value="suspension">Suspension</option>
                                            <option value="electrical">Electrical</option>
                                        </select>
                                    </div> */}
                                    <button type="submit" className="btn btn-primary style2">
                                        Save Part
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
