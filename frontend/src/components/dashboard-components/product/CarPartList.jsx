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
    if (carVariants.length > 0) {
      // Destroy existing DataTable before reinitializing
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
        debugger;
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

  return (
    <div className="card basic-data-table">
      {/* <div className="card-header">
        <h5 className="card-title mb-0">Car Part Group</h5>
      </div> */}
      <div className="card-body">
        <div className="table-responsive">
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
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <form onSubmit={handleUpdate} encType="multipart/form-data">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Car Part Group</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Group Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Group Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{ width: "100px", marginTop: "10px" }}
                      />
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn-theme-admin">Update</button>
                  <button type="button" className="btn-theme-admin" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarPartList;
