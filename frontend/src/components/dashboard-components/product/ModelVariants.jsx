import React, { useEffect, useState } from "react";
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../../../config";
import {  useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";


const ModelVariantsList = () => {
 

  const location = useLocation();
  const { id } = useParams();
 
  const { carModelItem: passedModelItem, carMakes } = location.state || {};
  const [carModelItem, setCarModelItem] = useState(passedModelItem || null);
  const [modelvariant, setModelvariant] = useState([]);
  

    // useEffect(() => {
    //     const fetchCarModel = async () => {
    //       try {
    //         const response = await axios.get(`${API_BASE_URL}api/home/car_variant/${id}/`);
    //         debugger;
    //         setModelvariant(response.data);
    //         console.log('got car-models payload:', response.data);
    //       } catch (error) {
    //         console.error('Error fetching car makes:', error);
    //       }
    //     };
       
    //     fetchCarModel();
    //   }, []);

    const [formData, setFormData] = useState({
    name: "",
    phone: "",
    carBrand: carModelItem?.car_make_name || "",
    carModel: carModelItem?.name || "",
    modelYear:
      carModelItem?.production_start_date && carModelItem?.production_end_date
        ? `(${carModelItem.production_start_date} - ${carModelItem.production_end_date})`
        : carModelItem?.generation || "",
    chassisNumber: "",
    message: "",
  });
  // Handle input changes
  const handleChange = (e) => {
    debugger;
  
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
  
      const token = localStorage.getItem("accessToken");
    try {
      await axios.post(`${API_BASE_URL}api/home/product_enquiry/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Swal.fire("Updated!", "Product enquiry submitted successfully.", "success");
      setFormData({
        name: "",
        phone: "",
        carBrand: carModelItem?.car_make_name || "",
        carModel: carModelItem?.name || "",
        modelYear:
          carModelItem?.production_start_date &&
          carModelItem?.production_end_date
            ? `(${carModelItem.production_start_date} - ${carModelItem.production_end_date})`
            : carModelItem?.generation || "",
        chassisNumber: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      Swal.fire("Error", "Something went wrong while submitting.", "error");
    }
  };

   useEffect(() => {
    if (!carModelItem && id) {
      axios
        .get(`${API_BASE_URL}api/home/car-model/${id}/`)
        .then((res) => {
          console.log("Fetched carModelItem:", res.data);
          setCarModelItem(res.data);

          // Also update localStorage
          const existing = JSON.parse(localStorage.getItem("selected_brand")) || {};
          const updated = {
            ...existing,
            brand_model: res.data.id,
            brand_model_name: res.data.name,
          };
          localStorage.setItem("selected_brand", JSON.stringify(updated));
        })
        .catch((err) => {
          console.error("Error fetching car model:", err);
          Swal.fire("Error", "Could not load car model data.", "error");
        });
    }
  }, [carModelItem, id]);


  // ✅ Fetch car variants once we have carModelItem
  useEffect(() => {
    if (!carModelItem?.id) return;

    axios
      .get(`${API_BASE_URL}api/home/car_variant/${carModelItem.id}/`)
      .then((res) => {
        setModelvariant(res.data);

        // Set form defaults
        setFormData((prev) => ({
          ...prev,
          carBrand: carModelItem?.car_make_name || "",
          carModel: carModelItem?.name || "",
          modelYear:
            carModelItem?.production_start_date && carModelItem?.production_end_date
              ? `(${carModelItem.production_start_date} - ${carModelItem.production_end_date})`
              : carModelItem?.generation || "",
        }));
      })
      .catch((err) => {
        console.error("Error fetching variants:", err);
      });
  }, [carModelItem]);
   if (!carModelItem) {
    return (
      <div className="container my-5">
        <h5>Loading car model details...</h5>
      </div>
    );
  }

    return (
        <div className="category-area-1 pb-100 brand-logo-display mt-5">
      <div className="container-fluid">
        <h5 className="text-center fw-extrabold mb-20">
          Select Your {carModelItem.name} {carModelItem.generation} Variants
        </h5>
        <div className="row mt-5 brands-sec d-flex justify-content-center align-items-center">
        
          <div className="col-sm-12 col-md-4 col-lg-3 mb-3">
            <div className="brand-models">
              <img src={carModelItem.image} alt={carModelItem.name} />
              <div className="text-center">
                {carModelItem.car_make_name} {carModelItem.name}{" "}
                {carModelItem.generation}
              </div>
            </div>
          </div>

         
          {modelvariant.length > 0 ? (
            <div className="col-sm-12 col-md-12 col-lg-9 mb-3">
              <div className="brand-models">
                <div className="card">
                  
                  <div className="card-body table-responsive">
                    <table className="table basic-border-table mb-0">
                      <thead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Region</th>
                          <th scope="col">Production Year</th>
                          <th scope="col">Engine</th>
                          <th scope="col">Chassis Type</th>
                          <th scope="col">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modelvariant.map((variant) => (
                          <tr key={variant.id}>
                            <td>
                              <Link
                                to={`/part-category/${variant.id}`}
                                onClick={() => {
                                  const existing =
                                    JSON.parse(
                                      localStorage.getItem("selected_brand")
                                    ) || {};
                                  const updated = {
                                    ...existing,
                                    model_variant: variant.id,
                                    model_variant_name: `${variant.name} (${carModelItem.fuel_type})`,
                                  };
                                  localStorage.setItem(
                                    "selected_brand",
                                    JSON.stringify(updated)
                                  );
                                }}
                                className="text-primary-600"
                              >
                                {variant.name} ({carModelItem.fuel_type})-
                                {carModelItem.generation}
                              </Link>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src="assets/images/user-list/user-list1.png"
                                  alt=""
                                  className="flex-shrink-0 me-12 radius-8"
                                />
                                <h6 className="text-md mb-0 fw-medium flex-grow-1">
                                  {variant.region}
                                </h6>
                              </div>
                            </td>
                            <td>
                              {variant.production_start_date} -{" "}
                              {variant.production_end_date}
                            </td>
                            <td>{variant.engine}</td>
                            <td>{variant.chassis_type}</td>
                            <td>{variant.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-sm-12 col-md-8 col-lg-8 mb-3">
              <div className="brand-models">
                <div className="card">
                  <div className="card-body">
                    <form className="comment-form bg-smoke mb-30" onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6 form-group">
                          <input
                            type="text"
                            placeholder="Your Name"
                            name="name"
                            required
                            className="form-control style-white"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6 form-group">
                          <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            className="form-control style-white"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6 form-group">
                          <input
                            type="text"
                            name="carBrand"
                            placeholder="Car Brand"
                            className="form-control style-white"
                            // defaultValue={carModelItem.car_make_name}
                            required
                            value={formData.carBrand}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6 form-group">
                          <input
                            type="text"
                            name="carModel"
                            placeholder="Car Model"
                            className="form-control style-white"
                            // defaultValue={carModelItem.name}
                            required
                            value={formData.carModel}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6 form-group">
                          <input
                            type="text"
                            name="modelYear"
                            placeholder="Model Year"
                            className="form-control style-white"
    //                         defaultValue={
    //   carModelItem.production_start_date && carModelItem.production_end_date
    //     ? `(${carModelItem.production_start_date} - ${carModelItem.production_end_date})`
    //     : carModelItem.generation || ""
    // }
     value={formData.modelYear}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6 form-group">
                          <input
                            type="text"
                             name="chassisNumber"
                            placeholder="Chassis Number"
                            className="form-control style-white"
                            value={formData.chassisNumber}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-12 form-group">
                          <textarea
                            placeholder="Message here.."
                             name="message"
                            className="form-control style-white"
                            value={formData.message}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                        <div className="col-12 form-group mb-0">
                          <button className="btn style2">Send now</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



export default ModelVariantsList;