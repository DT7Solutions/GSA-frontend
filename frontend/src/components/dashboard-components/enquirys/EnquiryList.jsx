// src/pages/EnquiryList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";

const EnquiryList = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${API_BASE_URL}api/home/get_enquiries/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEnquiries(response.data);
        setFilteredEnquiries(response.data);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
        Swal.fire("Error", "Failed to fetch enquiries.", "error");
      }
    };
    fetchEnquiries();
  }, []);

  // Handle search filter
  useEffect(() => {
    const results = enquiries.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.name?.toLowerCase().includes(searchLower) ||
        item.phone?.toLowerCase().includes(searchLower) ||
        item.carBrand?.toLowerCase().includes(searchLower) ||
        item.carModel?.toLowerCase().includes(searchLower) ||
        item.modelYear?.toString().includes(searchLower) ||
        item.chassisNumber?.toLowerCase().includes(searchLower) ||
        item.message?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredEnquiries(results);
  }, [searchTerm, enquiries]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="card basic-data-table">
      <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-3">
        <h5 className="card-title mb-0">Customer Enquiries</h5>
        
        {/* Search Box */}
        <div className="d-flex align-items-center gap-2">
          <div className="position-relative">
            <input
              type="text"
              className="form-control ps-40"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ minWidth: "250px" }}
            />
            <span className="position-absolute top-50 translate-middle-y ms-3">
              <i className="ri-search-line"></i>
            </span>
          </div>
          {searchTerm && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={clearSearch}
              title="Clear search"
            >
              <i className="ri-close-line"></i>
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body table-responsive">
          {/* Results count */}
          {searchTerm && (
            <div className="mb-3">
              <small className="text-muted">
                Showing {filteredEnquiries.length} of {enquiries.length} enquiries
              </small>
            </div>
          )}

          <table className="table table-bordered table-striped">
            <thead className="bg-theme-table">
              <tr>
                <th className="bg-theme-color">Name</th>
                <th className="bg-theme-color">Phone</th>
                <th className="bg-theme-color">Car Brand</th>
                <th className="bg-theme-color">Car Model</th>
                <th className="bg-theme-color">Model Year</th>
                <th className="bg-theme-color">Chassis Number</th>
                <th className="bg-theme-color">Message</th>
                <th className="bg-theme-color">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.carBrand}</td>
                    <td>{item.carModel}</td>
                    <td>{item.modelYear}</td>
                    <td>{item.chassisNumber || "—"}</td>
                    <td>{item.message || "—"}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    {searchTerm ? "No matching enquiries found." : "No enquiries found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnquiryList;