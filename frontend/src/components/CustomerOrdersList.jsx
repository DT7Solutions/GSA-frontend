import React, { useEffect, useState } from "react";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../config";
import Swal from "sweetalert2";
import Invoicetemplate from "../components/dashboard-components/Orders/Invoicetemplate";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import { jwtDecode } from "jwt-decode";

const CustomerOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tableInitialized, setTableInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.user_id;

        axios.get(`${API_BASE_URL}api/home/orders/get_orders_list/${userId}/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
      .then((response) => {
        setOrders(response.data);
        setTimeout(() => {
          if (!tableInitialized) {
            $('#dataTable').DataTable({ pageLength: 10, destroy: true });
            setTableInitialized(true);
          }
        }, 100);
      })
      .catch((error) => console.error("Error fetching orders:", error));
    }
  }, [token, tableInitialized]);

  const handleViewClick = (order) => {
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
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/home/orders/${selectedOrder.id}/status/`,
        { status: selectedOrder.status },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      if (response.status === 200) {
        setOrders(prev =>
          prev.map(o => o.id === selectedOrder.id ? { ...o, status: response.data.new_status || selectedOrder.status } : o)
        );
        await Swal.fire({ title: 'Status Updated', text: 'Order status has been updated.', icon: 'success', confirmButtonText: 'OK' });
        handleClose();
      } else {
        alert('Unexpected response');
      }
    } catch (err) {
      Swal.fire({ title: 'Update Failed', text: err.response?.data?.message || 'Try again.', icon: 'error', confirmButtonText: 'OK' });
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

  const handlePackingSlipPrint = (order) => {
    console.log(order)
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = { top: 60, left: 40, right: 40, bottom: 40 };
    const pageWidth = doc.internal.pageSize.getWidth();
  
    doc.setFontSize(20);
    doc.text('GowriSankar Agencies', margin.left, margin.top - 20);
    doc.setFontSize(10);
    doc.text('PLOT NO.381, PHASE 1 & 2, INDIRA', margin.left, margin.top);
    doc.text('AUTONAGAR, Guntur, Andhra Pradesh - 522001', margin.left, margin.top + 12);
    doc.text('Phone: +91 92480 22760', margin.left, margin.top + 24);
  
    doc.setFontSize(16);
    doc.text('PACKING SLIP', pageWidth - margin.right - 60, margin.top - 20, { align: 'right' });

    doc.setFontSize(12);
    doc.text(`Invoice #: ${order.razorpay_order_id}`, pageWidth - margin.right - 170, margin.top);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, pageWidth - margin.right - 170, margin.top + 14);
  
    const address = "6-134, Alluru, PV Palem, Guntur";

    doc.setFontSize(11);
    const deliverY = margin.top + 60;

    doc.text('Deliver To:', margin.left, deliverY);
    doc.text(`${order.user.first_name} ${order.user.last_name}`, margin.left + 70, deliverY);

    const wrappedAddress = doc.splitTextToSize(`${order.user.address}`, pageWidth - margin.left - margin.right - 70);
    doc.text(wrappedAddress, margin.left + 70, deliverY + 14);
  
    const rows = order.items.map((item, idx) => {
      const qty = item.quantity || 1;
      const unitPrice = item.unit_price ? item.unit_price.toFixed(2) : (order.total_price / order.items.length).toFixed(2);
      const amount = (qty * parseFloat(unitPrice)).toFixed(2);
      return [
        String(idx + 1).padStart(2, '0'),
        item.part_name || 'N/A',
        String(qty),
        `₹${unitPrice}`,
        `₹${amount}`,
        order.status.charAt(0).toUpperCase() + order.status.slice(1),
      ];
    });
  
    autoTable(doc, {
      startY: margin.top + 100,
      margin: { left: margin.left, right: margin.right },
      head: [['S.L', 'Product Name', 'Qty', 'Unit Price', 'Total', 'Status']],
      body: rows,
      theme: 'striped',
      styles: { cellPadding: 5, fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: 255, halign: 'center' },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 180 },
        2: { cellWidth: 50, halign: 'center' },
        3: { cellWidth: 80 },
        4: { cellWidth: 80 },
        5: { cellWidth: 80 }
      },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`, margin.left, doc.internal.pageSize.getHeight() - 20);
      }
    });
  
    const finalY = doc.lastAutoTable?.finalY || margin.top + 100;
  
    doc.setFontSize(12);
    doc.text(`Grand Total: ₹${order.total_price}`, margin.left, finalY + 30);
  
    doc.setFontSize(10);
    doc.text('Thank you for your business!', margin.left, finalY + 60);
  
    doc.save(`PackingSlip_${order.razorpay_order_id}.pdf`);
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      order.razorpay_order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.total_price.toString().includes(searchTerm) ||
      new Date(order.created_at).toLocaleDateString().includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || order.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

  return (
    <>
      <div className="card basic-data-table">
        <div className="card-header">
          <h5>Orders List</h5>
          <span className="orders-count">{orders.length} Orders</span>
        </div>
        <div className="card-body">
          {/* Desktop Table View */}
          <div className="desktop-table-wrapper">
            <div className="table-responsive">
              <table className="display table table-striped table-bordered mb-0" id="dataTable">
                <thead>
                  <tr><th>S.L</th><th>Order Id</th><th>Invoice Id</th><th>Order Date</th><th>Order Amount</th><th>Order Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={order.id}>
                      <td>{String(idx + 1).padStart(2, '0')}</td>
                      <td>{order.id}</td>
                      <td>#{order.razorpay_order_id}</td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>₹{order.total_price}</td>
                      <td>
                        <span
                          className={`badge ${order.status.toLowerCase() === 'pending'
                            ? 'badge-yellow'
                            : order.status.toLowerCase() === 'confirmed'
                              ? 'badge-green'
                              : order.status.toLowerCase() === 'progress'
                                ? 'badge-blue'
                                : ['failed', 'cancelled'].includes(order.status.toLowerCase())
                                  ? 'badge-red'
                                  : ''
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link 
                            to="#" 
                            onClick={() => handleViewClick(order)}
                            className="action-btn"
                            data-tooltip="View Order Details"
                          >
                            <Icon icon="mdi:eye-outline" />
                          </Link>
                          <Link 
                            to="#" 
                            onClick={() => handlePrint(order)}
                            className="action-btn"
                            data-tooltip="Download Invoice"
                          >
                            <Icon icon="mdi:file-document-outline" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-cards-wrapper">
            {/* Mobile Search and Filter */}
            <div className="mobile-filter-section">
              <div className="search-box">
                <Icon icon="mdi:magnify" className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Invoice ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="clear-search-btn">
                    <Icon icon="mdi:close-circle" />
                  </button>
                )}
              </div>

              <div className="filter-row">
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="status-filter"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="progress">In Progress</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {(searchTerm || filterStatus !== "all") && (
                  <button onClick={handleClearFilters} className="clear-filters-btn">
                    <Icon icon="mdi:filter-remove" />
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="results-info">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
            </div>

            {/* Order Cards */}
            {filteredOrders.length === 0 ? (
              <div className="no-results">
                <Icon icon="mdi:package-variant-closed" className="no-results-icon" />
                <h3>No Orders Found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredOrders.map((order, idx) => (
                <div key={order.id} className="mobile-order-card">
                  <div className="mobile-card-header">
                    <div className="order-number">
                      <span className="order-label">Order #{String(idx + 1).padStart(2, '0')}</span>
                      <span className="order-id">ID: {order.id}</span>
                    </div>
                    <span
                      className={`badge ${order.status.toLowerCase() === 'pending'
                        ? 'badge-yellow'
                        : order.status.toLowerCase() === 'confirmed'
                          ? 'badge-green'
                          : order.status.toLowerCase() === 'progress'
                            ? 'badge-blue'
                            : ['failed', 'cancelled'].includes(order.status.toLowerCase())
                              ? 'badge-red'
                              : ''
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mobile-card-body">
                    <div className="mobile-detail-row">
                      <span className="mobile-label">Invoice ID:</span>
                      <span className="mobile-value">#{order.razorpay_order_id}</span>
                    </div>
                    <div className="mobile-detail-row">
                      <span className="mobile-label">Order Date:</span>
                      <span className="mobile-value">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="mobile-detail-row">
                      <span className="mobile-label">Amount:</span>
                      <span className="mobile-value mobile-amount">₹{order.total_price}</span>
                    </div>
                  </div>

                  <div className="mobile-card-actions">
                    <button 
                      onClick={() => handleViewClick(order)}
                      className="mobile-action-btn mobile-btn-primary"
                    >
                      <Icon icon="mdi:eye-outline" />
                      View Details
                    </button>
                    <button 
                      onClick={() => handlePrint(order)}
                      className="mobile-action-btn mobile-btn-secondary"
                    >
                      <Icon icon="mdi:file-document-outline" />
                      Download
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedOrder && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-container">
            <div className="custom-modal-content">
              <div className="custom-modal-header">
                <h5>View Order</h5>
                <button onClick={handleClose} className="custom-close-btn">
                  <Icon icon="mdi:close" />
                </button>
              </div>
              
              <div className="custom-modal-body">
                <h6 className="section-title">Order Details</h6>
                
                {/* Order Details - Card Style for Mobile */}
                <div className="order-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Order ID</span>
                    <span className="detail-value">{selectedOrder.id}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">User Email</span>
                    <span className="detail-value">{selectedOrder.user.email}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Total Price</span>
                    <span className="detail-value">₹{selectedOrder.total_price}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className="detail-value">
                      <span className={`badge ${selectedOrder.status.toLowerCase() === 'pending' ? 'badge-yellow' : selectedOrder.status.toLowerCase() === 'confirmed' ? 'badge-green' : 'badge-blue'}`}>
                        {selectedOrder.status}
                      </span>
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Razorpay Order ID</span>
                    <span className="detail-value text-truncate">{selectedOrder.razorpay_order_id}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Payment ID</span>
                    <span className="detail-value text-truncate">{selectedOrder.razorpay_payment_id}</span>
                  </div>
                  
                  <div className="detail-item full-width">
                    <span className="detail-label">Signature</span>
                    <span className="detail-value text-truncate">{selectedOrder.razorpay_signature}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Created At</span>
                    <span className="detail-value">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Ordered Items */}
                <h6 className="section-title mt-4">Ordered Items</h6>
                <div className="items-container">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={item.id} className="item-card">
                      <div className="item-header">
                        <span className="item-number">#{index + 1}</span>
                        <span className="item-price">₹{item.price}</span>
                      </div>
                      <div className="item-body">
                        <div className="item-name">{item.part_name}</div>
                        <div className="item-quantity">Quantity: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Card Header */
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          background-color: #f8f9fa;
          border-bottom: 1px solid #e5e7eb;
        }

        .card-header h5 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .orders-count {
          background: #3b82f6;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Desktop Table Wrapper */
        .desktop-table-wrapper {
          display: block;
        }

        .table-responsive {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* Mobile Cards Wrapper - Hidden by default */
        .mobile-cards-wrapper {
          display: none;
        }

        /* Mobile Filter Section */
        .mobile-filter-section {
          background: white;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .search-box {
          position: relative;
          margin-bottom: 12px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          color: #6b7280;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 12px 44px 12px 44px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          outline: none;
        }

        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .clear-search-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .clear-search-btn:hover {
          color: #ef4444;
        }

        .clear-search-btn svg {
          font-size: 20px;
        }

        .filter-row {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 12px;
        }

        .status-filter {
          flex: 1;
          padding: 10px 14px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }

        .status-filter:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .clear-filters-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #fee2e2;
          color: #991b1b;
          border: none;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .clear-filters-btn:hover {
          background: #fecaca;
          transform: translateY(-1px);
        }

        .clear-filters-btn svg {
          font-size: 16px;
        }

        .results-info {
          text-align: center;
          color: #6b7280;
          font-size: 0.85rem;
          font-weight: 500;
          padding: 8px;
          background: #f9fafb;
          border-radius: 8px;
        }

        /* No Results Message */
        .no-results {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .no-results-icon {
          font-size: 80px;
          color: #d1d5db;
          margin-bottom: 16px;
        }

        .no-results h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .no-results p {
          font-size: 0.95rem;
          color: #6b7280;
          margin: 0;
        }

        /* Action Buttons Container */
        .action-buttons {
          display: flex;
          gap: 10px;
          align-items: center;
         
        }

        /* Action Button Styling */
        .action-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background-color: #f3f4f6;
          color: #4b5563;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .action-btn:hover {
          background-color: #3b82f6;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .action-btn svg {
          font-size: 18px;
        }

        /* Tooltip Styling */
        .action-btn::before {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          padding: 6px 12px;
          background-color: #1f2937;
          color: white;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          border-radius: 6px;
          opacity: 0;
          pointer-events: none;
          transition: all 0.2s ease;
          z-index: 1000;
        }

        .action-btn::after {
          content: '';
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-2px);
          border: 5px solid transparent;
          border-top-color: #1f2937;
          opacity: 0;
          pointer-events: none;
          transition: all 0.2s ease;
        }

        .action-btn:hover::before,
        .action-btn:hover::after {
          opacity: 1;
          transform: translateX(-50%) translateY(-4px);
        }

        /* Mobile Order Card Styles */
        .mobile-order-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .mobile-order-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .mobile-card-header {
          background: #0068a5;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .order-number {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .order-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
          letter-spacing: 0.5px;
        }

        .order-id {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .mobile-card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobile-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px solid #f3f4f6;
        }

        .mobile-detail-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .mobile-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .mobile-value {
          font-size: 0.875rem;
          color: #1f2937;
          font-weight: 600;
          text-align: right;
        }

        .mobile-amount {
          color: #059669;
          font-size: 1rem;
        }

        .mobile-card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 16px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }

        .mobile-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .mobile-action-btn svg {
          font-size: 18px;
        }

        .mobile-btn-primary {
          background: #0068a5;
          color: white;
        }

        .mobile-btn-primary:hover {
          background: #005a8c;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .mobile-btn-secondary {
          background: white;
          color: #0068a5;
          border: 2px solid #0068a5;
        }

        .mobile-btn-secondary:hover {
          background: #eff6ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
        }

        /* Modal Overlay */
        .custom-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 15px;
          overflow-y: auto;
        }

        /* Modal Container */
        .custom-modal-container {
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }

        /* Modal Content */
        .custom-modal-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
        }

        /* Modal Header */
        .custom-modal-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        .custom-modal-header h5 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .custom-close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .custom-close-btn:hover {
          color: #ef4444;
        }

        /* Modal Body */
        .custom-modal-body {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
        }

        /* Order Details Grid */
        .order-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .detail-item {
          background: #f9fafb;
          padding: 12px 15px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 0.95rem;
          color: #1f2937;
          font-weight: 500;
          word-break: break-word;
        }

        .text-truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Items Container */
        .items-container {
          display: grid;
          gap: 12px;
        }

        .item-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
          transition: all 0.2s;
        }

        .item-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #d1d5db;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .item-number {
          background: #3b82f6;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .item-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #059669;
        }

        .item-body {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .item-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .item-quantity {
          font-size: 0.9rem;
          color: #6b7280;
        }

        /* Badge Styles */
        .badge {
          display: inline-block;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .badge-yellow {
          background: #fef3c7;
          color: #92400e;
        }

        .badge-green {
          background: #d1fae5;
          color: #065f46;
        }

        .badge-blue {
          background: #dbeafe;
          color: #1e40af;
        }

        .badge-red {
          background: #fee2e2;
          color: #991b1b;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          /* Hide desktop table on mobile */
          .desktop-table-wrapper {
            display: none;
          }

          /* Show mobile cards on mobile */
          .mobile-cards-wrapper {
            display: block;
          }

          .card-header {
            padding: 1rem;
          }

          .card-header h5 {
            font-size: 1.1rem;
          }

          .orders-count {
            font-size: 0.75rem;
            padding: 3px 10px;
          }

          .custom-modal-overlay {
            padding: 10px;
            align-items: flex-start;
          }

          .custom-modal-container {
            max-height: 95vh;
          }

          .custom-modal-header {
            padding: 15px;
          }

          .custom-modal-header h5 {
            font-size: 1.1rem;
          }

          .custom-modal-body {
            padding: 15px;
          }

          .order-details-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .detail-item {
            padding: 10px 12px;
          }

          .section-title {
            font-size: 1rem;
          }

          .item-card {
            padding: 12px;
          }

          .item-name {
            font-size: 0.95rem;
          }

          .item-price {
            font-size: 1rem;
          }

          .action-buttons {
            gap: 8px;
          }

          .action-btn {
            width: 28px;
            height: 28px;
          }

          .action-btn svg {
            font-size: 16px;
          }

          /* Hide tooltips on mobile */
          .action-btn::before,
          .action-btn::after {
            display: none;
          }
        }

        /* Tablet Responsive */
        @media (min-width: 769px) and (max-width: 1024px) {
          .card-header h5 {
            font-size: 1.15rem;
          }

          .table-responsive {
            font-size: 0.9rem;
          }

          .action-btn {
            width: 30px;
            height: 30px;
          }

          .custom-modal-container {
            max-width: 700px;
          }

          .order-details-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }

        /* Small Mobile Devices */
        @media (max-width: 480px) {
          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

           .filter-row select{
            line-height: 40px!important;
            
          }

          .card-header h5 {
            font-size: 1rem;
          }

          .orders-count {
            align-self: flex-end;
          }

          .mobile-filter-section {
            padding: 12px;
          }

          .search-input {
            padding: 10px 40px 10px 40px;
            font-size: 0.85rem;
          }

          .search-icon {
            font-size: 18px;
            left: 12px;
          }

          .filter-row {
            flex-direction: column;
            gap: 8px;
          }

          .status-filter,
          .clear-filters-btn {
            width: 100%;
          }

          .clear-filters-btn {
            justify-content: center;
          }

          .results-info {
            font-size: 0.8rem;
          }

          .no-results {
            padding: 40px 16px;
          }

          .no-results-icon {
            font-size: 60px;
          }

          .no-results h3 {
            font-size: 1.1rem;
          }

          .no-results p {
            font-size: 0.875rem;
          }

          .mobile-card-header {
            padding: 12px;
          }

          .order-label {
            font-size: 0.8rem;
          }

          .order-id {
            font-size: 0.7rem;
          }

          .mobile-card-body {
            padding: 12px;
          }

          .mobile-detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .mobile-value {
            text-align: left;
          }

          .mobile-card-actions {
            padding: 12px;
            gap: 8px;
          }

          .mobile-action-btn {
            padding: 10px;
            font-size: 0.8rem;
          }

          .mobile-action-btn svg {
            font-size: 16px;
          }

          .custom-modal-header h5 {
            font-size: 1rem;
          }

          .detail-label {
            font-size: 0.7rem;
          }

          .detail-value {
            font-size: 0.9rem;
          }

          .badge {
            font-size: 0.75rem;
            padding: 3px 10px;
          }
        }

        /* Extra Small Mobile Devices */
        @media (max-width: 360px) {
          .mobile-card-actions {
            grid-template-columns: 1fr;
          }
         
          .mobile-action-btn {
            width: 100%;
          }
        }

        /* Landscape Mobile Orientation */
        @media (max-height: 600px) and (orientation: landscape) {
          .custom-modal-container {
            max-height: 85vh;
          }

          .custom-modal-body {
            padding: 10px 15px;
          }

          .order-details-grid {
            gap: 8px;
          }

          .detail-item {
            padding: 8px 10px;
          }
        }
      `}</style>
    </>
  );
};

export default CustomerOrdersList;