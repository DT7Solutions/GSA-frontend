import React, { useEffect, useState ,useRef } from "react";
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
import ReactDOM from 'react-dom';


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
      debugger;
      const response = await axios.put(
        `${API_BASE_URL}api/home/orders/${selectedOrder.id}/status/`,
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
// const handlePrint = (order) => {
//   const doc = new jsPDF({ unit: 'pt', format: 'a4' });
//   const margin = { top: 60, left: 40, right: 40, bottom: 40 };
//   const pageWidth = doc.internal.pageSize.getWidth();


//   doc.setFontSize(20);
//   doc.text('GowriSankar Agencies', margin.left, margin.top - 20);
//   doc.setFontSize(10);
//   doc.text('PLOT NO.381,PHASE 1&2,INDIRA', margin.left, margin.top);
//   doc.text('AUTONAGAR, Guntur, Andhra Pradesh 522001', margin.left, margin.top + 12);
//   doc.text('Phone: +91 92480 22760', margin.left, margin.top + 24);

  
//   doc.setFontSize(16);
//   doc.text('INVOICE', pageWidth - margin.right - 100, margin.top - 20, { align: 'right' });
//   doc.setFontSize(12);
//   doc.text(`Invoice #: ${order.razorpay_order_id}`, pageWidth - margin.right - 165, margin.top);
//   doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, pageWidth - margin.right - 165, margin.top + 14);


//   let subtotal = 0;


//   const rows = order.items.map((item, idx) => {
//     const qty = item.quantity || 1;
//     const unitPrice = item.price || 0; 
//     const amount = qty * unitPrice;
//     const tax = amount * 0.18;
//     const amount_tax = amount+tax
//     subtotal += amount;

//     return [
//       String(idx + 1).padStart(2, '0'),
//       item.part_group_name + item.part_no || 'N/A',
//       String(qty),
//       `INR ${unitPrice}`,
//       `INR ${tax.toFixed(2)}`,
//       `INR ${amount_tax.toFixed(2)}`
//     ];
//   });


//   autoTable(doc, {
//     startY: margin.top + 60,
//     margin: { left: margin.left, right: margin.right },
//     head: [['S.L', 'Name', 'Quantity', 'Unit Price', 'Tax (18%)', 'Amount']],
//     body: rows,
//     theme: 'striped',
//     styles: { cellPadding: 4, fontSize: 10 },
//     headStyles: { fillColor: [40, 40, 40], textColor: 255 },
//     columnStyles: {
//       0: { cellWidth: 30 },
//       1: { cellWidth: 200 },
//       2: { cellWidth: 50 },
//       3: { cellWidth: 80 },
//       4: { cellWidth: 80 },
//       5: { cellWidth: 100 }
//     },
//     didDrawPage: () => {
//       const pageCount = doc.internal.getNumberOfPages();
//       doc.setFontSize(9);
//       doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`, margin.left, doc.internal.pageSize.getHeight() - margin.bottom / 2);
//     }
//   });


//   const finalY = doc.lastAutoTable?.finalY || margin.top + 100;
//   const cgst = subtotal * 0.09;
//   const sgst = subtotal * 0.09;
//   const grandTotal = subtotal + cgst + sgst;


//   const rightAlignX = pageWidth - margin.right - 10;

//   doc.setFontSize(11);
//   doc.text(`Subtotal: INR ${subtotal.toFixed(2)}`, rightAlignX, finalY + 20, { align: 'right' });
//   doc.text(`CGST (9%): INR ${cgst.toFixed(2)}`, rightAlignX, finalY + 35, { align: 'right' });
//   doc.text(`SGST (9%): INR ${sgst.toFixed(2)}`, rightAlignX, finalY + 50, { align: 'right' });

//   doc.setFontSize(14);
//   doc.text(`Grand Total: INR ${grandTotal.toFixed(2)}`, rightAlignX, finalY + 70, { align: 'right' });

 
//   doc.save(`invoice_${order.razorpay_order_id}.pdf`);
// };
const invoiceRef = useRef();
const handlePrint = async (order) => {
  setSelectedOrder(order); // set data for template

  // temporarily render hidden invoice
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  document.body.appendChild(container);

  // render InvoiceTemplate with order data
  const div = document.createElement('div');
  container.appendChild(div);

  // ReactDOM rendering into container
  import('react-dom').then(ReactDOM => {
    ReactDOM.render(<Invoicetemplate ref={invoiceRef} order={order} company={{
      name: 'GowriSankar Agencies',
      logo: '/adminAssets/images/gallery/logo-light.png',
      addressLine1: 'PLOT NO.381, PHASE 1 & 2, INDIRA AUTONAGAR',
      cityState: 'Guntur, Andhra Pradesh',
      phone: '+91 92480 22760',
      signature: '/assets/img/signature.png'
    }} />, div);

    // wait a moment to render
    setTimeout(async () => {
      const invoiceNode = div;
      const canvas = await html2canvas(invoiceNode, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
      pdf.save(`Invoice_${order.razorpay_order_id}.pdf`);

      // cleanup
      ReactDOM.unmountComponentAtNode(div);
      container.remove();
    }, 100);
  });
};





//   packing slip
//   const handlePackingSlipPrint = (order) => {
//     debugger;

//     console.log(order)
//     const doc = new jsPDF({ unit: 'pt', format: 'a4' });
//     const margin = { top: 60, left: 40, right: 40, bottom: 40 };
//     const pageWidth = doc.internal.pageSize.getWidth();
  
    
//     doc.setFontSize(20);
//     doc.text('GowriSankar Agencies', margin.left, margin.top - 20);
//     doc.setFontSize(10);
//     doc.text('PLOT NO.381, PHASE 1 & 2, INDIRA', margin.left, margin.top);
//     doc.text('AUTONAGAR, Guntur, Andhra Pradesh - 522001', margin.left, margin.top + 12);
//     doc.text('Phone: +91 92480 22760', margin.left, margin.top + 24);
  
   
//     doc.setFontSize(16);
//     doc.text('PACKING SLIP', pageWidth - margin.right - 60, margin.top - 20, { align: 'right' });

//     doc.setFontSize(12);
//     doc.text(`Invoice #: ${order.razorpay_order_id}`, pageWidth - margin.right - 170, margin.top);
//     doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, pageWidth - margin.right - 170, margin.top + 14);
  
 
//      const user = order.user;


// const addressLines = [
//   `${user.first_name || ''} ${user.last_name || ''}`,              
//   `${user.address || ''}`,                                         
//   `${user.city || ''}, ${user.state || ''} - ${user.pincode || ''}`, 
//   `Phone: ${user.phone || ''}`                                     
// ];


// const deliverStartY = margin.top + 60;
// const lineHeight = 14;


// doc.setFontSize(11);
// doc.text('Deliver To:', margin.left, deliverStartY);

// const addressBlockStartY = deliverStartY + lineHeight;


// addressLines.forEach((line, index) => {
//   doc.text(line, margin.left + 70, deliverStartY + lineHeight * index);
// });


// const addressBlockHeight = lineHeight * addressLines.length;
// const tableStartY = addressBlockStartY + addressBlockHeight + 20; 



  
   
//     const rows = order.items.map((item, idx) => {
//       debugger;
//       const qty = item.quantity || 1;
//       const unitPrice = item.unit_price ? item.unit_price.toFixed(2) : (order.total_price / order.items.length).toFixed(2);
//       const amount = (qty * parseFloat(unitPrice)).toFixed(2);
//       return [
//         String(idx + 1).padStart(2, '0'),
//         item.part_group_name|| 'N/A',
//         String(qty),
//         `INR ${unitPrice}`,
//         `INR ${amount}`,
//         order.status.charAt(0).toUpperCase() + order.status.slice(1),
//       ];
//     });
  
//     autoTable(doc, {
//       startY: tableStartY,
//       margin: { left: margin.left, right: margin.right },
//       head: [['S.L', 'Product Name', 'Qty', 'Unit Price', 'Total', 'Status']],
//       body: rows,
//       theme: 'striped',
//       styles: { cellPadding: 5, fontSize: 10 },
//       headStyles: { fillColor: [0, 0, 0], textColor: 255, halign: 'center' },
//       columnStyles: {
//         0: { cellWidth: 30 },
//         1: { cellWidth: 180 },
//         2: { cellWidth: 50, halign: 'center' },
//         3: { cellWidth: 80 },
//         4: { cellWidth: 80 },
//         5: { cellWidth: 80 }
//       },
//       didDrawPage: (data) => {
//         const pageCount = doc.internal.getNumberOfPages();
//         doc.setFontSize(9);
//         doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`, margin.left, doc.internal.pageSize.getHeight() - 20);
//       }
//     });
  
//     const finalY = doc.lastAutoTable?.finalY || margin.top + 100;
  
 
//    doc.setFont("helvetica", "normal");
// doc.setFontSize(12);
// doc.text(`Grand Total: INR ${order.total_price}`, margin.left, finalY + 30);
// doc.text('Thank you for your business!', margin.left, finalY + 60);

  
   
  
  
//     doc.save(`PackingSlip_${order.razorpay_order_id}.pdf`);
//   };
  const handlePackingSlipPrint = async (order) => {
  if (!order) return;

  // Company info
  const company = {
    name: 'GowriSankar Agencies',
    logo: '/adminAssets/images/gallery/logo-light.png',
    addressLine1: 'PLOT NO.381, PHASE 1 & 2, INDIRA AUTONAGAR',
    cityState: 'Guntur, Andhra Pradesh',
    phone: '+91 92480 22760',
    signature: '/assets/img/signature.png',
  };

  // Create hidden container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  document.body.appendChild(container);

  // Render the PackingSlipTemplate
  ReactDOM.render(<PackingSlipTemplate order={order} company={company} />, container);

  // Wait a short moment to ensure rendering
  setTimeout(async () => {
    try {
      // Capture the rendered component as a canvas
      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      // Create PDF
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
      pdf.save(`PackingSlip_${order.razorpay_order_id || order.id}.pdf`);
    } catch (err) {
      console.error('Error generating packing slip PDF:', err);
    } finally {
      // Cleanup
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
    }
  }, 100);
};




  return (
      <div className="card basic-data-table">
          <div className="card-header"><h5>Orders List</h5></div>
          <div className="card-body">
              <table className="table bordered-table mb-0" id="dataTable">
                  <thead>
                      <tr><th>S.L</th><th>Order id</th><th>Invoice</th><th>Name</th><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr>
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
                                      className={` ${order.status.toLowerCase() === 'pending'
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
                                  <Link to="#" onClick={() => handleEditClick(order)}><Icon icon="lucide:edit" /></Link>&nbsp;&nbsp;&nbsp;
                                  <Link to="#" onClick={() => handlePrint(order)}> <Icon icon="mdi:file-document-outline" /> </Link>&nbsp;&nbsp;&nbsp;
                                  <Link to="#" onClick={() => handlePackingSlipPrint(order)}><Icon icon="mdi:package-variant-closed" /> </Link>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              

          </div>
          {showModal && selectedOrder && (
              <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <div className="modal-dialog"><div className="modal-content">
                      <div className="modal-header">
                          <h5>Edit Order</h5>
                          <button onClick={handleClose} className="btn-close">X</button>
                      </div>
                      <div className="modal-body">
                          <form>
                              {/* ... form fields ... */}
                              <div className="mb-3">
                                  <label>Status</label>
                                  <select name="status" value={selectedOrder.status} onChange={handleChange} className="form-select">
                                      <option value="pending">Pending</option>
                                      <option value="confirmed">Confirmed</option>
                                      <option value="progress">Progress</option>
                                      <option value="failed">Failed</option>
                                      <option value="cancelled">Cancelled</option>
                                      <option value="completed">Completed</option>
                                  </select>
                              </div>
                              <div className="text-end">
                                  <button type="button" className="btn btn-secondary me-2" onClick={handleClose}>Cancel</button>
                                  <button type="button" className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                              </div>
                          </form>
                      </div>
                  </div></div>
              </div>
          )}
      </div>
  );
};

export default OrdersList;
