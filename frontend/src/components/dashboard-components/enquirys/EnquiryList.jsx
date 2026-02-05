// src/pages/EnquiryList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";

const EnquiryList = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mobile pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, enquiries]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Pagination logic for mobile
  const getCurrentPageData = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredEnquiries.slice(indexOfFirstItem, indexOfLastItem);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredEnquiries.length / itemsPerPage);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top on mobile
    if (window.innerWidth < 992) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < getTotalPages()) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const totalPages = getTotalPages();
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const currentPageData = getCurrentPageData();
  const totalPages = getTotalPages();

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
            {currentPageData.length > 0 ? (
              <>
                {currentPageData.map((item) => (
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
                ))}

                {/* Mobile Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-container">
                    {/* Pagination Controls */}
                    <nav aria-label="Page navigation">
                      <ul className="pagination-list">
                        {/* Previous Button */}
                        <li className="pagination-item">
                          <button
                            className={`pagination-btn pagination-prev ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                          >
                            <i className="ri-arrow-left-s-line"></i>
                          </button>
                        </li>

                        {/* Page Numbers */}
                        {getPageNumbers().map((pageNum, idx) => (
                          pageNum === '...' ? (
                            <li key={`ellipsis-${idx}`} className="pagination-item pagination-ellipsis">
                              <span>...</span>
                            </li>
                          ) : (
                            <li key={pageNum} className="pagination-item">
                              <button
                                className={`pagination-btn pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                                onClick={() => handlePageChange(pageNum)}
                                aria-label={`Page ${pageNum}`}
                                aria-current={currentPage === pageNum ? 'page' : undefined}
                              >
                                {pageNum}
                              </button>
                            </li>
                          )
                        ))}

                        {/* Next Button */}
                        <li className="pagination-item">
                          <button
                            className={`pagination-btn pagination-next ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                          >
                            <i className="ri-arrow-right-s-line"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>

                    {/* Page Info */}
                    <div className="pagination-info">
                      <span className="pagination-text">
                        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                      </span>
                      <span className="pagination-separator">•</span>
                      <span className="pagination-text">
                        <strong>{filteredEnquiries.length}</strong> total enquiries
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-5">
                <i className="ri-inbox-line" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                <p className="text-muted mt-2">
                  {searchTerm ? "No matching enquiries found." : "No enquiries found."}
                </p>
                {searchTerm && (
                  <button
                    className="btn btn-sm btn-outline-primary mt-2"
                    onClick={clearSearch}
                  >
                    Clear Search
                  </button>
                )}
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

        /* ===== Modern Pagination Styles ===== */
        .pagination-container {
          margin-top: 2rem;
          padding: 1.25rem 1rem;
          background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
          border-radius: 12px;
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .pagination-list {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin: 0;
          padding: 0;
          list-style: none;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .pagination-item {
          display: inline-flex;
        }

        .pagination-btn {
          min-width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dee2e6;
          background: #ffffff;
          color: #495057;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0 12px;
          position: relative;
          overflow: hidden;
        }

        .pagination-btn:hover:not(.disabled) {
          background: #0068A5;
          color: #ffffff;
          border-color: #0068A5;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 104, 165, 0.3);
        }

        .pagination-btn.active {
          background: linear-gradient(135deg, #0068A5 0%, #0068A5 100%);
          color: #ffffff;
          border-color: #0068A5;
          box-shadow: 0 4px 12px rgba(0, 104, 165, 0.4);
          font-weight: 600;
        }

        .pagination-btn.disabled {
          background: #f8f9fa;
          color: #adb5bd;
          border-color: #e9ecef;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .pagination-prev,
        .pagination-next {
          font-size: 1.2rem;
          padding: 0;
          width: 40px;
        }

        .pagination-prev i,
        .pagination-next i {
          line-height: 1;
        }

        .pagination-ellipsis {
          display: inline-flex;
          align-items: center;
          padding: 0 8px;
          color: #6c757d;
          font-weight: 500;
          user-select: none;
        }

        .pagination-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 0.75rem;
          border-top: 1px solid #e9ecef;
        }

        .pagination-text {
          font-size: 0.813rem;
          color: #6c757d;
          line-height: 1.5;
        }

        .pagination-text strong {
          color: #212529;
          font-weight: 600;
        }

        .pagination-separator {
          color: #dee2e6;
          font-weight: 300;
          user-select: none;
        }

        /* Responsive adjustments */
        @media (max-width: 576px) {
          .pagination-container {
            padding: 1rem 0.75rem;
          }

          .pagination-btn {
            min-width: 36px;
            height: 36px;
            font-size: 0.813rem;
            padding: 0 10px;
          }

          .pagination-prev,
          .pagination-next {
            width: 36px;
            font-size: 1.1rem;
          }

          .pagination-list {
            gap: 4px;
          }

          .pagination-info {
            font-size: 0.75rem;
            gap: 6px;
          }
        }

        @media (max-width: 380px) {
          .pagination-btn {
            min-width: 32px;
            height: 32px;
            font-size: 0.75rem;
            padding: 0 8px;
          }

          .pagination-prev,
          .pagination-next {
            width: 32px;
            font-size: 1rem;
          }

          .pagination-list {
            gap: 3px;
          }
        }

        /* Animation for page change */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-body .card {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default EnquiryList;