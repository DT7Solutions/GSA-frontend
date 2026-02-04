import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { Icon } from "@iconify/react";
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";

const CarPartList = () => {
  const [carVariants, setCarVariantsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", image: null });
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchCarVariantsList();
  }, []);

  const fetchCarVariantsList = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}api/home/get_car_part_groups_list/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCarVariantsList(response.data);
      
    } catch (error) {
      console.error("Error fetching car parts:", error);
    }
  };

  useEffect(() => {
    if (carVariants.length > 0 && window.innerWidth >= 992) {
      // Only initialize DataTable on desktop
      if ($.fn.DataTable.isDataTable("#dataTable")) {
        $("#dataTable").DataTable().destroy();
      }
      $("#dataTable").DataTable({
        pageLength: 10,
        destroy: true,
      });
    }
  }, [carVariants]);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setFormData({ name: item.name, image: null });
    setPreviewImage(item.image || null);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      if (formData.image) {
        formPayload.append("image", formData.image);
      }

      await axios.put(
        `${API_BASE_URL}api/home/car_update_parts_group/${selectedItem.id}/`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire("Success", "Updated successfully!", "success");
      setShowModal(false);
      setSelectedItem(null);
      fetchCarVariantsList(); // Refresh table
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // Filter car variants based on search term
  const filteredCarVariants = carVariants.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card basic-data-table">
      <div className="card-body">
        {/* Search Box - Mobile Optimized */}
        <div className="mb-3 d-lg-none">
          <div className="position-relative">
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search car parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="position-absolute top-50 translate-middle-y ms-2">
              <Icon icon="ion:search-outline" />
            </span>
          </div>
          {searchTerm && (
            <div className="mt-2">
              <small className="text-muted">
                Showing {filteredCarVariants.length} of {carVariants.length} parts
              </small>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="table-responsive d-none d-lg-block">
          <table className="table table-striped table-hover align-middle" id="dataTable" data-page-length={10}>
            <thead>
              <tr>
                <th>S.L</th>
                <th>Name</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {carVariants.map((item, index) => (
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
                      className="btn-theme-admin py-3"
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

        {/* Mobile Card View */}
        <div className="d-lg-none">
          {filteredCarVariants.length > 0 ? (
            filteredCarVariants.map((item, index) => (
              <div key={item.id} className="card mb-3 shadow-sm border">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center gap-3">
                    {/* Image Section */}
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded"
                          style={{ 
                            width: "80px", 
                            height: "80px", 
                            objectFit: "cover",
                            border: "2px solid #e0e0e0"
                          }}
                        />
                      ) : (
                        <div 
                          className="rounded bg-light d-flex align-items-center justify-content-center"
                          style={{ 
                            width: "80px", 
                            height: "80px",
                            border: "2px solid #e0e0e0"
                          }}
                        >
                          <Icon icon="mdi:image-off-outline" className="text-muted" style={{ fontSize: "32px" }} />
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1 fw-semibold">{item.name}</h6>
                          <small className="text-muted">Part Group #{index + 1}</small>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleEditClick(item)}
                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 mt-2"
                      >
                        <Icon icon="lucide:edit" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <Icon 
                icon="mdi:car-off" 
                className="text-secondary-light" 
                style={{ fontSize: '64px' }} 
              />
              <p className="text-secondary-light mt-3 mb-0">
                {searchTerm ? "No matching car parts found" : "No car parts found"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal - Mobile Optimized */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <form onSubmit={handleUpdate} encType="multipart/form-data">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Car Part Group</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Group Name Input */}
                  <div className="mb-3">
                    <label className="form-label fw-medium">Group Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter group name"
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="mb-3">
                    <label className="form-label fw-medium">Group Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    <small className="text-muted d-block mt-1">
                      Supported formats: JPG, PNG, GIF
                    </small>
                  </div>

                  {/* Image Preview */}
                  {previewImage && (
                    <div className="mb-3">
                      <label className="form-label fw-medium">Preview</label>
                      <div className="text-center p-3 bg-light rounded">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="img-fluid rounded"
                          style={{ 
                            maxWidth: "100%", 
                            maxHeight: "200px",
                            objectFit: "contain"
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer - Desktop */}
                <div className="modal-footer d-none d-sm-flex">
                  <button 
                    type="button" 
                    className="btn-theme-admin" 
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-theme-admin">
                    Update
                  </button>
                </div>

                {/* Modal Footer - Mobile (Full Width Buttons) */}
                <div className="modal-footer d-sm-none d-flex flex-column gap-2">
                  <button type="submit" className="btn-theme-admin w-100">
                    Update
                  </button>
                  <button 
                    type="button" 
                    className="btn-theme-admin w-100" 
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 991px) {
          .card-body {
            padding: 16px !important;
          }
          
          .table-responsive {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
        
        @media (max-width: 576px) {
          .modal-dialog {
            margin: 0.5rem;
          }
          
          .modal-body {
            max-height: calc(100vh - 180px);
            overflow-y: auto;
          }
          
          .modal-header h5 {
            font-size: 1rem;
          }
          
          .card.shadow-sm {
            transition: transform 0.2s ease;
          }
          
          .card.shadow-sm:active {
            transform: scale(0.98);
          }
        }
        
        /* Improve touch targets on mobile */
        @media (max-width: 991px) {
          .btn {
            min-height: 44px;
          }
          
          .form-control {
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default CarPartList;