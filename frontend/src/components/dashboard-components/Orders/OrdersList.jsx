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
import { createRoot } from 'react-dom/client'; // ✅ Modern React 18 API

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tableInitialized, setTableInitialized] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      axios.get(`${API_BASE_URL}api/home/orders/get_orders_list/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
         console.log("📦 Orders Data:", response.data);
        // Check if shipping address is present
        response.data.forEach((order, idx) => {
          console.log(`Order ${idx + 1} Shipping Address:`, order.shipping_address);
        });
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
        setOrders(prev =>
          prev.map(o => o.id === selectedOrder.id ? { ...o, status: response.data.new_status || selectedOrder.status } : o)
        );
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

  // ✅ Invoice PDF with modern createRoot API
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

    // ✅ Use createRoot instead of ReactDOM.render
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
        // ✅ Modern way to unmount
        root.unmount();
        container.remove();
      }
    }, 100);
  };

  // ✅ Packing Slip PDF with modern createRoot API
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

    // ✅ Use createRoot instead of ReactDOM.render
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
        // ✅ Modern way to unmount
        root.unmount();
        container.remove();
      }
    }, 100);
  };

  return (
    <div className="card basic-data-table">
      {/* <div className="card-header"><h5>Orders List</h5></div> */}
      <div className="card-body">
        <div className="table-responsive">
        <table className="table bordered-table mb-0 sm-table" id="dataTable">
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
            {orders.map((order, idx) => (
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