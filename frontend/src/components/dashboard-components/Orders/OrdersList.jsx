import React, { useEffect, useState, useRef } from "react";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Invoicetemplate from '../Orders/Invoicetemplate';
import PackingSlipTemplate from '../Orders/PackingSlipTemplate';
import { createRoot } from 'react-dom/client';
import "../../../../src/assets/css/Auth.css"

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tableInitialized, setTableInitialized] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Mobile-specific states
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const token = localStorage.getItem("accessToken");
  const tableRef = useRef(null);

  useEffect(() => {
    if (token) {
      axios.get(`${API_BASE_URL}api/home/orders/get_orders_list/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
         console.log("📦 Orders Data:", response.data);
        response.data.forEach((order, idx) => {
          console.log(`Order ${idx + 1} Shipping Address:`, order.shipping_address);
        });
        
        // Sort orders by date (newest first)
        const sortedOrders = response.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      })
      .catch((error) => console.error("Error fetching orders:", error));
    }
  }, [token]);

  // Separate useEffect for DataTable initialization
  useEffect(() => {
    if (filteredOrders.length > 0 && !tableInitialized && window.innerWidth >= 992) {
      setTimeout(() => {
        if ($.fn.DataTable.isDataTable('#ordersDataTable')) {
          $('#ordersDataTable').DataTable().destroy();
        }
        tableRef.current = $('#ordersDataTable').DataTable({ 
          pageLength: 10, 
          destroy: true,
          order: [], // Disable initial sorting - we're already sorted
          columnDefs: [
            { orderable: false, targets: [0, 7] } // Disable sorting on S.L and Action columns
          ]
        });
        setTableInitialized(true);
      }, 100);
    }
  }, [filteredOrders, tableInitialized]);

  const handleEditClick = (order) => {
    setSelectedOrder({ ...order });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!token) {
      Swal.fire({
        title: 'No Token',
        text: 'You are not logged in. Please login to continue.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    try {
      const response = await axios.put(
        `${API_BASE_URL}api/home/orders/${selectedOrder.id}/status/`,
        { status: selectedOrder.status },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
  
      if (response.status === 200) {
        const updatedOrders = orders.map(o => 
          o.id === selectedOrder.id ? { ...o, status: response.data.new_status || selectedOrder.status } : o
        );
        
        // Keep the sorting (newest first) after update
        updatedOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setOrders(updatedOrders);
        applyDateFilter(updatedOrders);
        
        await Swal.fire({ 
          title: 'Status Updated', 
          text: 'Order status has been updated.', 
          icon: 'success', 
          confirmButtonText: 'OK' 
        });
        handleClose();
      } else {
        alert('Unexpected response');
      }
    } catch (err) {
      Swal.fire({ 
        title: 'Update Failed', 
        text: err.response?.data?.message || 'Try again.', 
        icon: 'error', 
        confirmButtonText: 'OK' 
      });
    }
  };

  const handlePrint = async (order) => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    const company = {
      name: 'GowriSankar Agencies',
      logo: '/adminAssets/images/gallery/logo-light.png',
      addressLine1: 'PLOT NO.381, PHASE 1 & 2, INDIRA AUTONAGAR',
      cityState: 'Guntur, Andhra Pradesh',
      phone: '+91 92480 22760',
      signature: '/assets/img/signature.png'
    };

    const root = createRoot(container);
    root.render(<Invoicetemplate order={order} company={company} />);

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(container, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
        pdf.save(`Invoice_${order.razorpay_order_id}.pdf`);
      } catch (err) {
        console.error('Error generating invoice PDF:', err);
      } finally {
        root.unmount();
        container.remove();
      }
    }, 100);
  };

  const handlePackingSlipPrint = async (order) => {
    if (!order) return;

    const company = {
      name: 'GowriSankar Agencies',
      logo: '/adminAssets/images/gallery/logo-light.png',
      addressLine1: 'PLOT NO.381, PHASE 1 & 2, INDIRA AUTONAGAR',
      cityState: 'Guntur, Andhra Pradesh',
      phone: '+91 92480 22760',
      signature: '/assets/img/signature.png',
    };

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<PackingSlipTemplate order={order} company={company} />);

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(container, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
        pdf.save(`PackingSlip_${order.razorpay_order_id || order.id}.pdf`);
      } catch (err) {
        console.error('Error generating packing slip PDF:', err);
      } finally {
        root.unmount();
        container.remove();
      }
    }, 100);
  };

  const applyDateFilter = (ordersToFilter = orders) => {
    let filtered = ordersToFilter;

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filtered = ordersToFilter.filter(order => {
        const orderDate = new Date(order.created_at);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate >= start && orderDate <= end;
      });
    } else if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = ordersToFilter.filter(order => {
        const orderDate = new Date(order.created_at);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate >= start;
      });
    } else if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = ordersToFilter.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate <= end;
      });
    }

    console.log('Filtering orders:', {
      startDate,
      endDate,
      totalOrders: ordersToFilter.length,
      filteredCount: filtered.length,
      sampleDates: ordersToFilter.slice(0, 3).map(o => o.created_at)
    });

    // Sort filtered orders by date (newest first)
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filtering
    
    // Refresh DataTable only on desktop
    if (window.innerWidth >= 992) {
      if (tableRef.current) {
        tableRef.current.destroy();
      }
      setTimeout(() => {
        if ($.fn.DataTable.isDataTable('#ordersDataTable')) {
          $('#ordersDataTable').DataTable().destroy();
        }
        tableRef.current = $('#ordersDataTable').DataTable({ 
          pageLength: 10, 
          destroy: true,
          order: [], // No initial sorting - we pre-sorted the data
          columnDefs: [
            { orderable: false, targets: [0, 7] } // Disable sorting on S.L and Action columns
          ]
        });
      }, 0);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    applyDateFilter();
  };

  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    setMobileSearchTerm('');
    setCurrentPage(1);
    
    // Reset to original orders (already sorted newest first)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setFilteredOrders(sortedOrders);
    
    if (window.innerWidth >= 992) {
      if (tableRef.current) {
        tableRef.current.destroy();
      }
      setTimeout(() => {
        if ($.fn.DataTable.isDataTable('#ordersDataTable')) {
          $('#ordersDataTable').DataTable().destroy();
        }
        tableRef.current = $('#ordersDataTable').DataTable({ 
          pageLength: 10, 
          destroy: true,
          order: [], // No initial sorting
          columnDefs: [
            { orderable: false, targets: [0, 7] }
          ]
        });
      }, 0);
    }
  };

  // Mobile search functionality
  const handleMobileSearch = (e) => {
    const searchValue = e.target.value;
    setMobileSearchTerm(searchValue);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Get filtered orders based on mobile search
  const getMobileFilteredOrders = () => {
    if (!mobileSearchTerm) return filteredOrders;

    const searchLower = mobileSearchTerm.toLowerCase();
    return filteredOrders.filter(order => {
      const orderId = `GSA${order.id}`.toLowerCase();
      const invoiceId = order.razorpay_order_id?.toLowerCase() || '';
      const productName = `${order.items[0]?.part_group_name}-${order.items[0]?.part_no}`.toLowerCase();
      const status = order.status?.toLowerCase() || '';
      const amount = order.total_price?.toString() || '';

      return (
        orderId.includes(searchLower) ||
        invoiceId.includes(searchLower) ||
        productName.includes(searchLower) ||
        status.includes(searchLower) ||
        amount.includes(searchLower)
      );
    });
  };

  // Get current page orders for mobile
  const getCurrentPageOrders = () => {
    const searchFiltered = getMobileFilteredOrders();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return searchFiltered.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Get total pages for mobile
  const getTotalPages = () => {
    const searchFiltered = getMobileFilteredOrders();
    return Math.ceil(searchFiltered.length / itemsPerPage);
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of orders list on mobile
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

  // Generate page numbers for pagination
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

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case 'pending': return 'badge-yellow';
      case 'confirmed': return 'badge-green';
      case 'completed': return 'badge-pink';
      case 'progress': return 'badge-blue';
      case 'failed':
      case 'cancelled': return 'badge-red';
      default: return '';
    }
  };

  const currentPageOrders = getCurrentPageOrders();
  const totalPages = getTotalPages();
  const mobileFilteredCount = getMobileFilteredOrders().length;

  return (
    <div className="card basic-data-table">
      <div className="card-body">
        {/* Date Filter Form - Mobile Optimized */}
        <div className="mb-5 p-3 border rounded bg-light">
          <h6 className="mb-3">Filter Orders by Date</h6>

          <form onSubmit={handleFilterSubmit} >
            <div className="row g-3">
              {/* Date Inputs */}
              <div className="col-md-4 col-12">
                <label htmlFor="startDate" className="form-label">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="col-md-4 col-12">
                <label htmlFor="endDate" className="form-label">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {/* Buttons - Desktop */}
              <div className="col-md-4 d-none d-md-flex align-items-end">
                <button
                  type="submit"
                  className="btn-theme-admin btn-primary me-2 d-inline-flex align-items-center"
                >
                  <Icon icon="mdi:filter" className="me-1" />
                  <span>Apply Filter</span>
                </button>

                <button
                  type="button"
                  className="btn-theme-admin btn-secondary d-inline-flex align-items-center"
                  onClick={handleResetFilter}
                >
                  <Icon icon="mdi:refresh" className="me-1" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Buttons - Mobile (Full Width) */}
              <div className="col-12 d-md-none">
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn-theme-admin btn-primary flex-grow-1 d-inline-flex align-items-center justify-content-center"
                  >
                    <Icon icon="mdi:filter" className="me-1" />
                    <span>Apply</span>
                  </button>

                  <button
                    type="button"
                    className="btn-theme-admin btn-secondary flex-grow-1 d-inline-flex align-items-center justify-content-center"
                    onClick={handleResetFilter}
                  >
                    <Icon icon="mdi:refresh" className="me-1" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {(startDate || endDate) && (
            <div className="mt-3">
              <small className="text-muted">
                Showing {filteredOrders.length} of {orders.length} orders
              </small>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="table-responsive d-none d-lg-block">
          <table className="table bordered-table mb-0 sm-table" id="ordersDataTable">
            <thead>
              <tr>
                <th>S.L</th>
                <th>Order id</th>
                <th>Invoice</th>
                <th>Name</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => (
                <tr key={order.id}>
                  <td>{String(idx + 1).padStart(2, '0')}</td>
                  <td>GSA{order.id}</td>
                  <td>#{order.razorpay_order_id}</td>
                  <td>{order.items[0]?.part_group_name}-{order.items[0]?.part_no}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>₹{order.total_price}</td>
                  <td>
                    <span className={getStatusBadgeClass(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link 
                      to="#" 
                      onClick={() => handleEditClick(order)}
                      className="action-icon"
                      data-tooltip="Edit Order"
                    >
                      <Icon icon="lucide:edit" />
                    </Link>
                    &nbsp;&nbsp;&nbsp;
                    <Link 
                      to="#" 
                      onClick={() => handlePrint(order)}
                      className="action-icon"
                      data-tooltip="Download Invoice"
                    >
                      <Icon icon="mdi:file-document-outline" />
                    </Link>
                    &nbsp;&nbsp;&nbsp;
                    <Link 
                      to="#" 
                      onClick={() => handlePackingSlipPrint(order)}
                      className="action-icon"
                      data-tooltip="Download Packing Slip"
                    >
                      <Icon icon="mdi:package-variant-closed" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="d-lg-none">
          {/* Mobile Search Bar */}
          <div className="mb-3">
            <div className="position-relative">
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Search orders by ID, invoice, product, status..."
                value={mobileSearchTerm}
                onChange={handleMobileSearch}
              />
              <Icon 
                icon="mdi:magnify" 
                className="position-absolute text-muted"
                style={{ 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  fontSize: '20px'
                }}
              />
              {mobileSearchTerm && (
                <button
                  type="button"
                  className="btn btn-link position-absolute text-muted p-0"
                  style={{ 
                    right: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)'
                  }}
                  onClick={() => {
                    setMobileSearchTerm('');
                    setCurrentPage(1);
                  }}
                >
                  <Icon icon="mdi:close-circle" style={{ fontSize: '20px' }} />
                </button>
              )}
            </div>
            
            {/* Search Results Info */}
            {mobileSearchTerm && (
              <div className="mt-2">
                <small className="text-muted">
                  Found {mobileFilteredCount} order{mobileFilteredCount !== 1 ? 's' : ''}
                </small>
              </div>
            )}
          </div>

          {/* Order Cards */}
          {currentPageOrders.length > 0 ? (
            <>
              {currentPageOrders.map((order, idx) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + idx;
                return (
                  <div key={order.id} className="card mb-3 shadow-sm border">
                    <div className="card-body p-3">
                      {/* Header with Order ID and Status */}
                      <div className="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom">
                        <div>
                          <h6 className="mb-1 fw-bold text-theme">GSA{order.id}</h6>
                          <small className="text-muted">#{order.razorpay_order_id}</small>
                        </div>
                        <span className={`${getStatusBadgeClass(order.status)} px-2 py-1 text-xs`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Order Details */}
                      <div className="row g-2 mb-3">
                        <div className="col-12">
                          <div className="d-flex align-items-start">
                            <Icon icon="mdi:package-variant" className="text-muted mt-1 me-2 flex-shrink-0" />
                            <div className="flex-grow-1">
                              <small className="text-muted d-block">Product</small>
                              <span className="text-sm fw-medium">
                                {order.items[0]?.part_group_name}-{order.items[0]?.part_no}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="d-flex align-items-start">
                            <Icon icon="mdi:calendar-outline" className="text-muted mt-1 me-2 flex-shrink-0" />
                            <div>
                              <small className="text-muted d-block">Date</small>
                              <span className="text-sm fw-medium">
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="d-flex align-items-start">
                            <Icon icon="mdi:currency-inr" className="text-muted mt-1 me-2 flex-shrink-0" />
                            <div>
                              <small className="text-muted d-block">Amount</small>
                              <span className="text-sm fw-bold text-success">₹{order.total_price}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2 py-4 border-top">
                        <button
                          type="button"
                          className=" btn-theme-admin btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                          onClick={() => handleEditClick(order)}
                        >
                          <Icon icon="lucide:edit" />
                          <span className="d-none d-sm-inline">Edit</span>
                        </button>
                        
                        <button
                          type="button"
                          className=" btn-theme-admin d-flex align-items-center justify-content-center"
                          onClick={() => handlePrint(order)}
                          title="Download Invoice"
                        >
                          <Icon icon="mdi:file-document-outline" />
                        </button>
                        
                        <button
                          type="button"
                          className=" btn-theme-admin btn-outline-info d-flex align-items-center justify-content-center"
                          onClick={() => handlePackingSlipPrint(order)}
                          title="Download Packing Slip"
                        >
                          <Icon icon="mdi:package-variant-closed" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Mobile Pagination */}
              {totalPages > 1 && (
                <div className="d-flex flex-column align-items-center mt-4 mb-3">
                  {/* Page Info */}
                  <div className="mb-3 text-center">
                    <small className="text-muted">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, mobileFilteredCount)} of {mobileFilteredCount} orders
                    </small>
                  </div>

                  {/* Pagination Controls */}
                  <div className="d-flex align-items-center gap-2 flex-wrap justify-content-center">
                    {/* Previous Button */}
                    <button
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      style={{ minWidth: '80px' }}
                    >
                      <Icon icon="mdi:chevron-left" className="me-1" />
                      <span>Prev</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="d-flex gap-1">
                      {getPageNumbers().map((pageNum, idx) => (
                        pageNum === '...' ? (
                          <span key={`ellipsis-${idx}`} className="px-2 py-1">
                            ...
                          </span>
                        ) : (
                          <button
                            key={pageNum}
                            className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => handlePageChange(pageNum)}
                            style={{ minWidth: '40px' }}
                          >
                            {pageNum}
                          </button>
                        )
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      style={{ minWidth: '80px' }}
                    >
                      <span>Next</span>
                      <Icon icon="mdi:chevron-right" className="ms-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <Icon icon="mdi:package-variant-closed-remove" className="text-secondary-light" style={{ fontSize: '64px' }} />
              <p className="text-secondary-light mt-3 mb-0">
                {mobileSearchTerm ? "No orders found matching your search" :
                 startDate || endDate ? "No orders found for the selected date range" : "No orders found"}
              </p>
              {mobileSearchTerm && (
                <button
                  className="btn btn-sm btn-outline-primary mt-3"
                  onClick={() => {
                    setMobileSearchTerm('');
                    setCurrentPage(1);
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Order Modal */}
      {showModal && selectedOrder && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Order</h5>
                <button onClick={handleClose} className="btn-close">X</button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Order ID</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={`GSA${selectedOrder.id}`} 
                      disabled 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Invoice ID</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={`#${selectedOrder.razorpay_order_id}`} 
                      disabled 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select 
                      name="status" 
                      value={selectedOrder.status} 
                      onChange={handleChange} 
                      className="form-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="progress">Progress</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Desktop Button Layout */}
                  <div className="text-end d-none d-sm-block">
                    <button 
                      type="button" 
                      className="btn-theme-admin me-3" 
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn-theme-admin" 
                      onClick={handleSave}
                    >
                      Save Changes
                    </button>
                  </div>

                  {/* Mobile Button Layout */}
                  <div className="d-sm-none d-flex flex-column gap-2">
                    <button 
                      type="button" 
                      className="btn-theme-admin w-100" 
                      onClick={handleSave}
                    >
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      className="btn-theme-admin w-100" 
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 991px) {
          .card-body {
            padding: 16px !important;
          }
          
          .badge-yellow,
          .badge-green,
          .badge-pink,
          .badge-blue,
          .badge-red {
            font-size: 0.7rem;
            padding: 4px 8px;
            border-radius: 4px;
          }

          .btn-sm {
            font-size: 0.875rem;
            padding: 0.375rem 0.75rem;
          }

          .pagination-btn {
            min-width: 36px;
            height: 36px;
          }
        }
        
        @media (max-width: 576px) {
          .modal-dialog {
            margin: 0.5rem;
          }
          
          .modal-body {
            padding: 1rem;
          }
          
          .modal-header h5 {
            font-size: 1rem;
          }
          
          .filter-section {
            padding: 12px !important;
          }

          .btn-sm {
            font-size: 0.8rem;
            padding: 0.25rem 0.5rem;
          }
        }

        /* Search input styling */
        .form-control:focus {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }

        /* Pagination button styling */
        .btn-outline-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }

        /* Smooth transitions */
        .card {
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default OrdersList;