import React, { useEffect, useState } from "react";
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
  
  // Mobile Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
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
        `${API_BASE_URL}api/home/car_model_variant_list/`
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

  // Pagination logic for mobile
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

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

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be marked as deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) return;

    try {
      await axios.patch(
        `${API_BASE_URL}api/home/car-part-section-status-update/${selectedItem.id}/status/`,
        { status: "deleted" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        title: "Deleted!",
        text: "Category has been marked as deleted.",
        icon: "success",
        timer: 1200,
        showConfirmButton: false
      });

      setCarCategoryList(prev => {
        const updated = prev.filter(p => p.id !== selectedItem.id);

        // After filtering, fix pagination safely
        const newFiltered = updated.filter(item => {
          const searchLower = searchTerm.toLowerCase();
          return (
            item.name?.toLowerCase().includes(searchLower) ||
            item.variant_name?.toLowerCase().includes(searchLower) ||
            item.variant?.name?.toLowerCase().includes(searchLower)
          );
        });

        const newTotalPages = Math.max(
          1,
          Math.ceil(newFiltered.length / itemsPerPage)
        );

        setCurrentPage(prevPage =>
          prevPage > newTotalPages ? newTotalPages : prevPage
        );

        return updated;
      });

      setShowPartGroupModal(false);
      setIsEdit(false);
      setSelectedItem(null);

    } catch (error) {
      console.error("Delete failed:", error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
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

  // Inline styles for mobile cards and pagination
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
        {/* Mobile Search, Items Per Page and Add Button */}
        <div className="d-lg-none mb-3">
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

          {/* Search Bar */}
          <div className="position-relative mb-2 my-3">
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="position-absolute top-50 translate-middle-y ms-2">
             
            </span>
          </div>

          {/* Results Info */}
          {searchTerm && (
            <small className="text-muted d-block mb-2 mt-2">
              Showing {filteredCategories.length} of {carCategory.length} categories
            </small>
          )}

          {/* Add Button */}
          {/* <button
            onClick={handleAddClick}
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
            style={{ minHeight: '44px' }}
          >
            <Icon icon="ic:baseline-plus" />
            <span>Add New Category</span>
          </button> */}
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
              {currentItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
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

        {/* Pagination */}
        <div className="d-none d-lg-block mt-3">
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center mb-0 flex-wrap" style={{ gap: "4px" }}>
                
                {/* Previous */}
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {/* Dynamic Page Numbers */}
                {getPageNumbers().map((pageNum, idx) =>
                  pageNum === "..." ? (
                    <li key={`ellipsis-${idx}`} className="page-item disabled">
                      <button className="page-link disabled">...</button>
                    </li>
                  ) : (
                    <li
                      key={pageNum}
                      className={`page-item ${currentPage === pageNum ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  )
                )}

                {/* Next */}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>

              </ul>
            </nav>
          )}
        </div>

        {/* Mobile Card View with Pagination */}
        <div className="d-lg-none">
          {currentItems.length > 0 ? (
            <>
              {currentItems.map((item, index) => (
                <div key={item.id} style={styles.mobileCard}>
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
                              height: "90px",
                              objectFit: "cover",
                              border: "2px solid #e0e0e0",
                            }}
                          />
                        ) : (
                          <div
                            className="rounded bg-light d-flex align-items-center justify-content-center"
                            style={{
                              width: "120px",
                              height: "90px",
                              border: "2px solid #e0e0e0",
                            }}
                          >
                            <Icon
                              icon="mdi:image-off-outline"
                              className="text-muted"
                              style={{ fontSize: "28px" }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="flex-grow-1">
                        {/* Category Name */}
                        <h6 className="mb-2 fw-semibold" style={{ fontSize: '1rem' }}>
                          {item.name}
                        </h6>

                        {/* Variant Info */}
                        <div className="d-flex align-items-center mb-2">
                          <Icon
                            icon="mdi:car-outline"
                            className="text-muted me-2"
                            style={{ fontSize: '18px' }}
                          />
                          <div>
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                              Variant
                            </small>
                            <span style={{ fontSize: '0.85rem' }} className="fw-medium">
                              {item.variant_name || item.variant?.name || "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Category Number */}
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          Category #{indexOfFirstItem + index + 1}
                        </small>

                        {/* Action Button */}
                        <div className="mt-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="btn-theme-admin btn-outline-primary d-flex align-items-center gap-1"
                            style={{ minHeight: '36px' }}
                          >
                            <Icon icon="lucide:edit" />
                            <span>Edit</span>
                          </button>
                        </div>
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
                    Showing {filteredCategories.length > 0 ? indexOfFirstItem + 1 : 0} to{' '}
                    {Math.min(indexOfLastItem, filteredCategories.length)} of {filteredCategories.length} entries
                    {searchTerm && ` (filtered from ${carCategory.length} total entries)`}
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
          <div style={styles.modalOverlay} onClick={() => {
            setShowPartGroupModal(false);
            setIsEdit(false);
            setSelectedItem(null);
          }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
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
                      aria-label="Close"
                      style={{ cursor: 'pointer' }}
                    >
                      <Icon icon="lucide:x" width="20" height="20" />
                    </button>
                  </div>
                  <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
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

                  {/* Modal Footer with Cancel and Submit buttons */}
                  <div className="modal-footer">
                    <div className="d-flex gap-2 w-100">
                      {isEdit && (
                        <button
                          type="button"
                          className="btn btn-danger flex-fill"
                          onClick={handleDelete}
                          style={{ minHeight: '44px' }}
                        >
                          <Icon icon="lucide:trash" className="me-1" />
                          Delete
                        </button>
                      )}
                      <button 
                        type="submit" 
                        className="btn btn-primary flex-fill"
                        style={{ minHeight: '44px' }}
                      >
                        <Icon icon={isEdit ? "lucide:check" : "lucide:save"} className="me-1" />
                        {isEdit ? "Update" : "Add"}
                      </button>
                    </div>
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

export default CarCategoryList;