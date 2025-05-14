import React, { useEffect, useState } from "react";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [tableInitialized, setTableInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      axios.get(`${API_BASE_URL}api/home/orders/get_orders_list/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOrders(response.data);

        // Delay DataTable init to ensure table has been rendered
        setTimeout(() => {
          if (!tableInitialized) {
            $('#dataTable').DataTable({
              pageLength: 10,
              destroy: true, // allow re-init
            });
            setTableInitialized(true);
          }
        }, 100); // Wait briefly to ensure table is rendered
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
    }
  }, []);

  return (
    <div className="card basic-data-table">
      <div className="card-header">
        <h5 className="card-title mb-0">Orders List</h5>
      </div>
      <div className="card-body">
        <table
          className="table bordered-table mb-0"
          id="dataTable"
          data-page-length={10}
        >
          <thead>
            <tr>
              <th>
                <div className="form-check style-check d-flex align-items-center">
                  {/* <input className="form-check-input" type="checkbox" /> */}
                  <label className="form-check-label">S.L</label>
                </div>
              </th>
              <th>Invoice</th>
              <th>Name</th>
              <th>Issued Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order.id}>
                  <td>
                    <div className="form-check style-check d-flex align-items-center">
                      {/* <input className="form-check-input" type="checkbox" /> */}
                      <label className="form-check-label">
                        {String(index + 1).padStart(2, '0')}
                      </label>
                    </div>
                  </td>
                  <td>
                    <Link to="#" className="text-primary-600">
                      #{order.razorpay_order_id}
                    </Link>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src="assets/images/user-list/user-list1.png"
                        alt=""
                        className="flex-shrink-0 me-12 radius-8"
                      />
                      <h6 className="text-md mb-0 fw-medium flex-grow-1">
                        {order.items[0]?.part_name || "N/A"}
                      </h6>
                    </div>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>₹{order.total_price.toFixed(2)}</td>
                  <td>
                    <span
                      className={`px-24 py-4 rounded-pill fw-medium text-sm ${
                        order.status === 'confirmed'
                          ? 'bg-success-focus text-success-main'
                          : order.status === 'pending'
                          ? 'bg-warning-focus text-warning-main'
                          : 'bg-secondary text-white'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <Link to="#" className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center">
                      <Icon icon="iconamoon:eye-light" />
                    </Link>
                    <Link to="#" className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center">
                      <Icon icon="lucide:edit" />
                    </Link>
                    <Link to="#" className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center">
                      <Icon icon="mingcute:delete-2-line" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;
