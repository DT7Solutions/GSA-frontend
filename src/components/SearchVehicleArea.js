import React, { useState } from "react";
import carData from "../data/carData"; // Import carData

const SearchVehicleArea = () => {
  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  // Handle car maker change
  const handleMakerChange = (e) => {
    const maker = e.target.value;
    setSelectedMaker(maker);
    setModels(maker ? Object.keys(carData[maker]?.models || {}) : []);
    setSelectedModel("");
    setYears([]);
  };

  // Handle model change
  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    setYears(selectedMaker ? carData[selectedMaker]?.models[model] || [] : []);
  };

  return (
    <div className="service-area-2 space-bottom position-relative z-index-common search-filters">
      <div className="container">
        <div className="row gy-4 justify-content-center">
          <div className="col-xxl-12 col-xl-12">
            <div className="service-form-wrap">
              <h3 className="text-light text-center pb-4 pt-3">Search Car Parts For Any Car</h3>
              <form className="default-form-wrap">
                <div className="row serarch-filter">
                  {/* Select Car Maker */}
                  <div className="col-sm-12 col-md-3 col-lg-2">
                    <div className="form-group m-0">
                      <select className="form-select" onChange={handleMakerChange} value={selectedMaker}>
                        <option value="">Select Car Maker</option>
                        {Object.keys(carData).map((maker) => (
                          <option key={maker} value={maker}>{maker}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Select Model */}
                  <div className="col-sm-12 col-md-3 col-lg-2">
                    <div className="form-group m-0">
                      <select className="form-select" onChange={handleModelChange} value={selectedModel} disabled={!models.length}>
                        <option value="">Select Model</option>
                        {models.map((model) => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Select Year */}
                  <div className="col-sm-12 col-md-2 col-lg-2">
                    <div className="form-group m-0">
                      <select className="form-select" disabled={!years.length}>
                        <option value="">Select Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                   {/* Select Year */}
                   <div className="col-sm-12 col-md-2 col-lg-2">
                    <div className="form-group m-0">
                      <select className="form-select" disabled={!years.length}>
                        <option value="">Select Modification</option>
                        <option value="">petrol</option>
                        <option value="">Diesel</option>
                        {/* {years.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))} */}
                      </select>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="col-sm-12 col-md-2">
                    <button type="submit" className="btn style2 m-0 w-100 search-btn">
                      Search Parts
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchVehicleArea;
