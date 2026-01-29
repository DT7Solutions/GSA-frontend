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
    if (carCategory.length > 0) {
      const table = $("#dataTable").DataTable();
      return () => {
        table.destroy();
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
      debugger;
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

  return (
    <div className="card basic-data-table">
      {/* <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Car Part Category List</h5>
      
      </div> */}
      <div className="card-body">
        <div className="table-responsive">
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

        {/* Modal */}
        {showPartGroupModal && (
          <div
            className="modal d-block"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog">
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
                    <div className="mb-3">
                      <label className="form-label">Variant</label>
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

                    <div className="mb-3">
                      <label className="form-label">Category Name</label>
                      <input
                        type="text"
                        className="form-control"
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
                  <div className="modal-footer">
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
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarCategoryList;
