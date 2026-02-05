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
        <div className="d-flex align-items-center gap-2 w-100 w-md-auto">
          <div className="position-relative flex-grow-1">
            <input
              type="text"
              className="form-control ps-40"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ minWidth: "200px" }}
            />
            <span className="position-absolute top-50 translate-middle-y ms-3">
              <i className="ri-search-line"></i>
            </span>
          </div>
          {searchTerm && (
            <button
              className="btn btn-sm btn-outline-danger flex-shrink-0"
              onClick={clearSearch}
              title="Clear search"
            >
              <i className="ri-close-line"></i>
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {/* Results count */}
          {searchTerm && (
            <div className="mb-3">
              <small className="text-muted">
                Showing {filteredEnquiries.length} of {enquiries.length} enquiries
              </small>
            </div>
          )}

          {/* Desktop Table View */}
          <div className="table-responsive d-none d-lg-block">
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

          {/* Mobile Card View */}
          <div className="d-lg-none">
            {filteredEnquiries.length > 0 ? (
              filteredEnquiries.map((item) => (
                <div key={item.id} className="card mb-3 shadow-sm">
                  <div className="card-body border">
                    <div className="row g-2">
                      <div className="col-12">
                        <h6 className="text-theme mb-2">
                          <i className="ri-user-line me-2"></i>
                          {item.name}
                        </h6>
                      </div>
                      
                      <div className="col-6">
                        <small className="text-muted d-block">Phone</small>
                        <strong>{item.phone}</strong>
                      </div>
                      
                      <div className="col-6">
                        <small className="text-muted d-block">Date</small>
                        <strong>{new Date(item.created_at).toLocaleDateString()}</strong>
                      </div>
                      
                      <div className="col-12">
                        <hr className="my-2" />
                      </div>
                      
                      <div className="col-6">
                        <small className="text-muted d-block">Car Brand</small>
                        <strong>{item.carBrand}</strong>
                      </div>
                      
                      <div className="col-6">
                        <small className="text-muted d-block">Car Model</small>
                        <strong>{item.carModel}</strong>
                      </div>
                      
                      <div className="col-6">
                        <small className="text-muted d-block">Model Year</small>
                        <strong>{item.modelYear}</strong>
                      </div>
                      
                      <div className="col-6">
                        <small className="text-muted d-block">Chassis Number</small>
                        <strong>{item.chassisNumber || "—"}</strong>
                      </div>
                      
                      {item.message && (
                        <>
                          <div className="col-12">
                            <hr className="my-2" />
                          </div>
                          <div className="col-12">
                            <small className="text-muted d-block">Message</small>
                            <p className="mb-0 mt-1">{item.message}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">
                <i className="ri-inbox-line" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                <p className="text-muted mt-2">
                  {searchTerm ? "No matching enquiries found." : "No enquiries found."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for additional mobile responsiveness */}
      <style jsx>{`
        @media (max-width: 576px) {
          .card-header h5 {
            font-size: 1.1rem;
          }
          
          .form-control {
            font-size: 0.9rem;
          }
          
          .card-body .card {
            border-radius: 8px;
          }
        }
        
        @media (max-width: 768px) {
          .w-md-auto {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EnquiryList;