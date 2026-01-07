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

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tableInitialized, setTableInitialized] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
    if (filteredOrders.length > 0 && !tableInitialized) {
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
    
    // Refresh DataTable
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
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    applyDateFilter();
  };

  const handleResetFilter = () => {
    setStartDate('');
    setEndDate('');
    
    // Reset to original orders (already sorted newest first)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setFilteredOrders(sortedOrders);
    
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
  };

  return (
    <div className="card basic-data-table">
      <div className="card-body">
        {/* Date Filter Form */}
       <div className="mb-5 p-3 border rounded bg-light">
  <h6 className="mb-3">Filter Orders by Date</h6>

  <form onSubmit={handleFilterSubmit}>
    <div className="row g-3 align-items-end">
      <div className="col-md-4">
        <label htmlFor="startDate" className="form-label">Start Date</label>
        <input
          type="date"
          id="startDate"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="col-md-4">
        <label htmlFor="endDate" className="form-label">End Date</label>
        <input
          type="date"
          id="endDate"
          className="form-control"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="col-md-4 d-flex align-items-end">
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
    </div>
  </form>

  {(startDate || endDate) && (
    <div className="mt-2">
      <small className="text-muted">
        Showing {filteredOrders.length} of {orders.length} orders
      </small>
    </div>
  )}
</div>


        <div className="table-responsive">
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
                  <span
                    className={`${
                      order.status.toLowerCase() === 'pending'
                        ? 'badge-yellow'
                        : order.status.toLowerCase() === 'confirmed'
                        ? 'badge-green'
                        : order.status.toLowerCase() === 'completed'
                        ? 'badge-pink'
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
                  <Link to="#" onClick={() => handleEditClick(order)}>
                    <Icon icon="lucide:edit" />
                  </Link>
                  &nbsp;&nbsp;&nbsp;
                  <Link to="#" onClick={() => handlePrint(order)}>
                    <Icon icon="mdi:file-document-outline" />
                  </Link>
                  &nbsp;&nbsp;&nbsp;
                  <Link to="#" onClick={() => handlePackingSlipPrint(order)}>
                    <Icon icon="mdi:package-variant-closed" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {showModal && selectedOrder && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Order</h5>
                <button onClick={handleClose} className="btn-close">X</button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label>Status</label>
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
                  <div className="text-end">
                    <button 
                      type="button" 
                      className="btn btn-secondary me-2" 
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={handleSave}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;