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
  
  // Mobile Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setFormData({ name: "", image: null });
    setPreviewImage(null);
  };

  // Filter car variants based on search term
  const filteredCarVariants = carVariants.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic for mobile
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCarVariants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCarVariants.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Generate page numbers for mobile pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Inline styles
  const styles = {
    mobileCard: {
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      transition: 'box-shadow 0.3s ease',
      marginBottom: '1rem'
    },
    pageLinkMobile: {
      padding: '6px 12px',
      fontSize: '0.9rem',
      minWidth: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1050,
      overflowY: 'auto',
      padding: '15px'
    }
  };

  return (
    <div className="card basic-data-table">
      <div className="card-body">
        {/* Mobile Search and Items Per Page */}
        <div className="mb-3 d-lg-none">
          {/* Items Per Page Selector */}
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ whiteSpace: 'nowrap', fontSize: '0.9rem' }}>Show</span>
            <select 
              className="form-select form-select-sm" 
              style={{ width: 'auto', minWidth: '70px' }}
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span style={{ whiteSpace: 'nowrap', fontSize: '0.9rem' }}>entries</span>
          </div>

          {/* Search Box */}
          <div className="position-relative">
            <input
              type="text"
              className="form-control ps-5 my-3"
              placeholder="Search car parts..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="position-absolute top-50 translate-middle-y ms-2">
              
            </span>
          </div>

          {/* Results Info */}
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

        {/* Mobile Card View with Pagination */}
        <div className="d-lg-none">
          {currentItems.length > 0 ? (
            <>
              {currentItems.map((item, index) => (
                <div key={item.id} style={styles.mobileCard}>
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
                              width: "90px", 
                              height: "90px", 
                              objectFit: "cover",
                              border: "2px solid #e0e0e0"
                            }}
                          />
                        ) : (
                          <div 
                            className="rounded bg-light d-flex align-items-center justify-content-center"
                            style={{ 
                              width: "90px", 
                              height: "90px",
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
                            <h6 className="mb-1 fw-semibold" style={{ fontSize: '1rem' }}>
                              {item.name}
                            </h6>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                              Part Group #{indexOfFirstItem + index + 1}
                            </small>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => handleEditClick(item)}
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2 mt-2"
                          style={{ minHeight: '36px' }}
                        >
                          <Icon icon="lucide:edit" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mobile Pagination */}
              <div className="mt-3">
                {/* Pagination Info */}
                <div className="mb-2">
                  <p className="mb-0 small text-center">
                    Showing {filteredCarVariants.length > 0 ? indexOfFirstItem + 1 : 0} to{' '}
                    {Math.min(indexOfLastItem, filteredCarVariants.length)} of {filteredCarVariants.length} entries
                    {searchTerm && ` (filtered from ${carVariants.length} total entries)`}
                  </p>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <nav>
                    <ul className="pagination justify-content-center mb-0 flex-wrap" style={{ gap: '4px' }}>
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          style={styles.pageLinkMobile}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <Icon icon="lucide:chevron-left" />
                        </button>
                      </li>
                      
                      {getPageNumbers().map((pageNum, idx) => (
                        pageNum === '...' ? (
                          <li key={`ellipsis-${idx}`} className="page-item disabled">
                            <span className="page-link" style={styles.pageLinkMobile}>...</span>
                          </li>
                        ) : (
                          <li
                            key={pageNum}
                            className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              style={styles.pageLinkMobile}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </button>
                          </li>
                        )
                      ))}

                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          style={styles.pageLinkMobile}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <Icon icon="lucide:chevron-right" />
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            </>
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
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleUpdate} encType="multipart/form-data">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Car Part Group</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCloseModal}
                    aria-label="Close"
                    style={{ cursor: 'pointer' }}
                  >
                    <Icon icon="lucide:x" width="20" height="20" />
                  </button>
                </div>
                <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                  {/* Group Name Input */}
                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      Group Name <span className="text-danger">*</span>
                    </label>
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

                {/* Modal Footer */}
                <div className="modal-footer">
                  <div className="d-flex gap-2 w-100">
                    <button 
                      type="button" 
                      className="btn btn-secondary flex-fill" 
                      onClick={handleCloseModal}
                      style={{ minHeight: '44px' }}
                    >
                      <Icon icon="lucide:x" className="me-1" />
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary flex-fill"
                      style={{ minHeight: '44px' }}
                    >
                      <Icon icon="lucide:check" className="me-1" />
                      Update
                    </button>
                  </div>
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

        /* Search input styling */
        .position-relative input {
          padding-left: 2.5rem;
        }

        /* Button hover effects */
        .btn-close:hover {
          opacity: 1 !important;
        }

        .btn-secondary {
          background-color: #6c757d;
          border-color: #6c757d;
          color: #fff;
        }

        .btn-secondary:hover {
          background-color: #5a6268;
          border-color: #545b62;
        }

        .modal-header .btn-close {
          padding: 0.5rem;
          margin: -0.5rem -0.5rem -0.5rem auto;
        }

        /* Pagination styling */
        .pagination {
          margin-bottom: 0;
        }

        .page-link {
          border-radius: 4px;
        }

        @media (max-width: 575px) {
          .modal-footer .d-flex {
            flex-direction: column;
          }

          .modal-footer .flex-fill {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CarPartList;