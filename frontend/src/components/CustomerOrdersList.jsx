import React, { useEffect, useState } from "react";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../config";
import Swal from "sweetalert2";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { jwtDecode } from "jwt-decode";

const CustomerOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tableInitialized, setTableInitialized] = useState(false);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
        debugger;
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

//   invoice pdf 
  const handlePrint = (order) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = { top: 60, left: 40, right: 40, bottom: 40 };
    const pageWidth = doc.internal.pageSize.getWidth();

    // Company Header
    doc.setFontSize(20);
    doc.text('GowriSankar Agencies', margin.left, margin.top - 20);
    doc.setFontSize(10);
    doc.text('PLOT NO.381,PHASE 1&2,INDIRA', margin.left, margin.top);
    doc.text('AUTONAGAR ,Guntur,Andhra Pradesh 522001', margin.left, margin.top + 12);
    doc.text('Phone:+91 92480 22760', margin.left, margin.top + 24);

    // Invoice Metadata
    doc.setFontSize(16);
    doc.text('INVOICE', pageWidth - margin.right - 100, margin.top - 20, { align: 'right' });
    doc.setFontSize(12);
    doc.text(`Invoice #: ${order.razorpay_order_id}`, pageWidth - margin.right - 165, margin.top);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, pageWidth - margin.right - 165, margin.top + 14);

    // Table Rows
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
      startY: margin.top + 60,
      margin: { left: margin.left, right: margin.right },
      head: [['S.L', 'Name', 'Quantity', 'Unit Price', 'Amount', 'Status']],
      body: rows,
      theme: 'striped',
      styles: { cellPadding: 4, fontSize: 10 },
      headStyles: { fillColor: [40, 40, 40], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 200 },
        2: { cellWidth: 50 },
        3: { cellWidth: 80 },
        4: { cellWidth: 80 },
        5: { cellWidth: 100 }
      },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`, margin.left, doc.internal.pageSize.getHeight() - margin.bottom / 2);
      }
    });

    const finalY = doc.lastAutoTable?.finalY || margin.top + 100;
    doc.setFontSize(14);
    doc.text(`Grand Total: ₹${order.total_price}`, margin.left, finalY + 30);

    doc.save(`invoice_${order.razorpay_order_id}.pdf`);
  };


//   packing slip
  const handlePackingSlipPrint = (order) => {
    debugger;

    console.log(order)
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = { top: 60, left: 40, right: 40, bottom: 40 };
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // Company Header
    doc.setFontSize(20);
    doc.text('GowriSankar Agencies', margin.left, margin.top - 20);
    doc.setFontSize(10);
    doc.text('PLOT NO.381, PHASE 1 & 2, INDIRA', margin.left, margin.top);
    doc.text('AUTONAGAR, Guntur, Andhra Pradesh - 522001', margin.left, margin.top + 12);
    doc.text('Phone: +91 92480 22760', margin.left, margin.top + 24);
  
    // Packing Slip Header
    doc.setFontSize(16);
    doc.text('PACKING SLIP', pageWidth - margin.right - 60, margin.top - 20, { align: 'right' });

    doc.setFontSize(12);
    doc.text(`Invoice #: ${order.razorpay_order_id}`, pageWidth - margin.right - 170, margin.top);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, pageWidth - margin.right - 170, margin.top + 14);
  
    // Receiver Info (Optional)
  // Receiver Info (Deliver To section)
    //   const customer_name = {order.user.first_name};
      const address = "6-134, Alluru, PV Palem, Guntur";

      doc.setFontSize(11);
      const deliverY = margin.top + 60;

      // Label
      doc.text('Deliver To:', margin.left, deliverY);

      doc.text(`${order.user.first_name} ${order.user.last_name}`, margin.left + 70, deliverY);

      const wrappedAddress = doc.splitTextToSize(`${order.user.address}`, pageWidth - margin.left - margin.right - 70);
      doc.text(wrappedAddress, margin.left + 70, deliverY + 14);

  
    // Table Data
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
  
    // Grand Total
    doc.setFontSize(12);
    doc.text(`Grand Total: ₹${order.total_price}`, margin.left, finalY + 30);
  
    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your business!', margin.left, finalY + 60);
  
    // Save PDF
    doc.save(`PackingSlip_${order.razorpay_order_id}.pdf`);
  };
  




  return (
 
        <div className="card basic-data-table">
            <div className="card-header"><h5>Orders List</h5></div>
            <div className="card-body">
                <table className="table bordered-table mb-0" id="dataTable">
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
                                        className={` ${order.status.toLowerCase() === 'pending'
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
                                    <Link to="#" onClick={() => handleEditClick(order)}><Icon icon="lucide:edit" /></Link>&nbsp;&nbsp;&nbsp;
                                    <Link to="#" onClick={() => handlePrint(order)}> <Icon icon="mdi:file-document-outline" /> </Link>&nbsp;&nbsp;&nbsp;
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && selectedOrder && (
                <div
                    className="modal d-flex align-items-center justify-content-center"
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1000,


                    }}
                >
                    <div className="modal-dialog order-model-dialog" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5>View Order</h5>
                            <button onClick={handleClose} className="btn-close">X</button>
                        </div>
                        <div className="modal-body">
                            <h5 className="mb-3">Order Details</h5>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Order ID</th>
                                        <td>{selectedOrder.id}</td>
                                    </tr>
                                    <tr>
                                        <th>User Email</th>
                                        <td>{selectedOrder.user.email}</td>
                                    </tr>
                                    <tr>
                                        <th>Total Price</th>
                                        <td>{selectedOrder.total_price}</td>
                                    </tr>
                                    <tr>
                                        <th>Status</th>
                                        <td>{selectedOrder.status}</td>
                                    </tr>
                                    <tr>
                                        <th>Razorpay Order ID</th>
                                        <td>{selectedOrder.razorpay_order_id}</td>
                                    </tr>
                                    <tr>
                                        <th>Payment ID</th>
                                        <td>{selectedOrder.razorpay_payment_id}</td>
                                    </tr>
                                    <tr>
                                        <th>Signature</th>
                                        <td>{selectedOrder.razorpay_signature}</td>
                                    </tr>
                                    <tr>
                                        <th>Created At</th>
                                        <td>{selectedOrder.created_at}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h6 className="mt-4">Ordered Items</h6>
                              <table className="table table-striped">
                                  <thead>
                                      <tr>
                                          <th>#</th>
                                          <th>Part Name</th>
                                          <th>Quantity</th>
                                          <th>Price</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {selectedOrder.items?.map((item, index) => (
                                          <tr key={item.id}>
                                              <td>{index + 1}</td>
                                              <td>{item.part_name}</td>
                                              <td>{item.quantity}</td>
                                              <td>₹{item.price}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                        </div>

                    </div>
                </div>
              </div>
            )}
      </div >
      
  );
};

export default CustomerOrdersList;
