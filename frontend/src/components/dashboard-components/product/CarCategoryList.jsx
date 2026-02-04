import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables.js";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";

const CarCategoryList = () => {
  const [carCategory, setCarCategoryList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPartGroupModal, setShowPartGroupModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [carModelVariant, setCarModelVariant] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("accessToken");

  // Fetch Category List
  const fetchCarCategoryList = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}api/home/get_parts_category_list/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCarCategoryList(response.data);
    } catch (error) {
      console.error("Error fetching car category list:", error);
    }
  };

  // Fetch Variants List
  const fetchCarMakes = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}api/home/car_model_varian_list/`
      );
      setCarModelVariant(response.data);
    } catch (error) {
      console.error("Error fetching car makes:", error);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchCarCategoryList();
    fetchCarMakes();
  }, []);

  // DataTable initialization and cleanup on data change
  useEffect(() => {
    if (carCategory.length > 0 && window.innerWidth >= 992) {
      // Only initialize DataTable on desktop
      if ($.fn.DataTable.isDataTable("#dataTable")) {
        $("#dataTable").DataTable().destroy();
      }
      const table = $("#dataTable").DataTable({
        pageLength: 10,
        destroy: true,
      });
      return () => {
        if ($.fn.DataTable.isDataTable("#dataTable")) {
          table.destroy();
        }
      };
    }
  }, [carCategory]);

  const handleEditClick = (item) => {
    // Find matching variant object by name (case insensitive)
    const selectedvariant = carModelVariant.find(
      (variant) =>
        variant.name.toLowerCase() ===
        (item.variant_name || item.variant?.name || "").toLowerCase()
    );

    setSelectedItem({
      ...item,
      variant_id: selectedvariant || null,
    });
    setIsEdit(true);
    setShowPartGroupModal(true);
  };

  const handleAddClick = () => {
    setSelectedItem({
      name: "",
      variant_id: null,
    });
    setIsEdit(false);
    setShowPartGroupModal(true);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: selectedItem.name,
        variant_id: selectedItem.variant_id?.id || null,
      };

      if (isEdit && selectedItem?.id) {
        await axios.put(
          `${API_BASE_URL}api/home/car_update_parts_category/${selectedItem.id}/`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire("Updated!", "Category updated successfully", "success");
      } else {
        await axios.post(
          `${API_BASE_URL}api/home/create_parts_category/`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire("Added!", "Category added successfully", "success");
      }

      setShowPartGroupModal(false);
      setIsEdit(false);
      setSelectedItem(null);
      fetchCarCategoryList();
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  // Filter categories based on search term
  const filteredCategories = carCategory.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(searchLower) ||
      item.variant_name?.toLowerCase().includes(searchLower) ||
      item.variant?.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="card basic-data-table">
      <div className="card-body">
        {/* Mobile Search and Add Button */}
        <div className="d-lg-none mb-3">
          <div className="position-relative mb-2">
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="position-absolute top-50 translate-middle-y ms-2">
              <Icon icon="ion:search-outline" />
            </span>
          </div>
          {searchTerm && (
            <small className="text-muted d-block mb-2">
              Showing {filteredCategories.length} of {carCategory.length} categories
            </small>
          )}
          <button
            onClick={handleAddClick}
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <Icon icon="ic:baseline-plus" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="table-responsive d-none d-lg-block">
          <table
            className="table table-striped table-hover align-middle"
            id="dataTable"
            data-page-length={10}
          >
            <thead>
              <tr>
                <th>S.L</th>
                <th>Image</th>
                <th>Variant Name</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {carCategory.map((item, index) => (
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
                  <td>{item.variant_name || item.variant?.name}</td>
                  <td>{item.name}</td>
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
          {filteredCategories.length > 0 ? (
            filteredCategories.map((item, index) => (
              <div key={item.id} className="card mb-3 shadow-sm border">
                <div className="card-body p-3">
                  <div className="d-flex gap-3">
                    {/* Image Section */}
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded"
                          style={{
                            width: "120px",
                            height: "80px",
                            objectFit: "cover",
                            border: "2px solid #e0e0e0",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded bg-light d-flex align-items-center justify-content-center"
                          style={{
                            width: "120px",
                            height: "80px",
                            border: "2px solid #e0e0e0",
                          }}
                        >
                          <Icon
                            icon="mdi:image-off-outline"
                            className="text-muted"
                            style={{ fontSize: "32px" }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-grow-1">
                      {/* Category Name */}
                      <h6 className="mb-2 fw-semibold">{item.name}</h6>

                      {/* Variant Info */}
                      <div className="d-flex align-items-center mb-2">
                        <Icon
                          icon="mdi:car-outline"
                          className="text-muted me-2"
                        />
                        <div>
                          <small className="text-muted d-block">Variant</small>
                          <span className="text-sm fw-medium">
                            {item.variant_name || item.variant?.name || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Category Number */}
                      <small className="text-muted">
                        Category #{index + 1}
                      </small>

                      {/* Action Button */}
                      <div className="mt-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                        >
                          <Icon icon="lucide:edit" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5">
              <Icon
                icon="mdi:package-variant-closed-remove"
                className="text-secondary-light"
                style={{ fontSize: "64px" }}
              />
              <p className="text-secondary-light mt-3 mb-0">
                {searchTerm
                  ? "No matching categories found"
                  : "No categories found"}
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit Modal - Mobile Optimized */}
        {showPartGroupModal && (
          <div
            className="modal d-block"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <form onSubmit={handleAddOrUpdate}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {isEdit ? "Edit Category" : "Add Category"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setShowPartGroupModal(false);
                        setIsEdit(false);
                        setSelectedItem(null);
                      }}
                    />
                  </div>
                  <div className="modal-body">
                    {/* Variant Selection */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Variant <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={selectedItem?.variant_id?.id || ""}
                        onChange={(e) => {
                          const selected = carModelVariant.find(
                            (v) => v.id === parseInt(e.target.value)
                          );
                          setSelectedItem((prev) => ({
                            ...prev,
                            variant_id: selected || null,
                          }));
                        }}
                        required
                      >
                        <option value="">Select Variant</option>
                        {carModelVariant.map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category Name */}
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Category Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter category name"
                        value={selectedItem?.name || ""}
                        onChange={(e) =>
                          setSelectedItem((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Modal Footer - Desktop */}
                  <div className="modal-footer d-none d-sm-flex">
                    <button
                      type="button"
                      className="btn-theme-admin"
                      onClick={() => {
                        setShowPartGroupModal(false);
                        setIsEdit(false);
                        setSelectedItem(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-theme-admin">
                      {isEdit ? "Update" : "Add"}
                    </button>
                  </div>

                  {/* Modal Footer - Mobile (Full Width Buttons) */}
                  <div className="modal-footer d-sm-none d-flex flex-column gap-2">
                    <button type="submit" className="btn-theme-admin w-100">
                      {isEdit ? "Update Category" : "Add Category"}
                    </button>
                    <button
                      type="button"
                      className="btn-theme-admin w-100"
                      onClick={() => {
                        setShowPartGroupModal(false);
                        setIsEdit(false);
                        setSelectedItem(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

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

          .form-control,
          .form-select {
            min-height: 44px;
          }
        }

        /* Search input styling */
        .position-relative input {
          padding-left: 2.5rem;
        }

        .position-relative .icon {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default CarCategoryList;