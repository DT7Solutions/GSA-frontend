import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Thankyou = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = params.get("order_id");
  
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchCartCount } = useContext(CartContext);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("accessToken");
      
      console.log("\n" + "=".repeat(60));
      console.log("📦 THANK YOU PAGE - Fetching Order Details");
      console.log("=".repeat(60));
      console.log("Order ID:", orderId);
      console.log("=".repeat(60) + "\n");

      try {
        const response = await axios.get(
          `${API_BASE_URL}api/home/orders/${orderId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        console.log("\n" + "=".repeat(60));
        console.log("✅ Order Details Received:");
        console.log("=".repeat(60));
        console.log("Order ID:", response.data.id);
        console.log("Total Price:", response.data.total_price);
        console.log("Items Count:", response.data.items?.length);
        console.log("Shipping Address:", response.data.shipping_address?.name);
        console.log("=".repeat(60) + "\n");
        
        setOrderDetails(response.data);

        await fetchCartCount();
      } catch (err) {
        console.error("\n" + "=".repeat(60));
        console.error("❌ Error fetching order details:");
        console.error("=".repeat(60));
        console.error("Error:", err);
        console.error("Response:", err.response?.data);
        console.error("=".repeat(60) + "\n");
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, fetchCartCount]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="container">
          <div className="alert alert-danger text-center">
            <h4>{error || "Order not found"}</h4>
            <Link to="/" className="btn btn-primary mt-3">Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals - safely convert to numbers
  const subtotal = orderDetails.items?.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return acc + (price * quantity);
  }, 0) || 0;
  
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = parseFloat(orderDetails.total_price) || (subtotal + cgst + sgst);

  return (
    <div className="py-5" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <style>{`
          .thank-you-header {
            background: #fff;
            color: white;
            padding: 3rem 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            text-align: center;
            border: 1px solid #d1d5db !important;
          }
          .order-section {
            background: white;
            border-radius: 10px;
            padding: 2rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .section-title {
            color: #0068a5;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #e9ecef;
          }
          .product-item {
            display: flex;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid #e9ecef;
          }
          .product-item:last-child {
            border-bottom: none;
          }
          .product-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            margin-right: 1.5rem;
          }
          .product-details {
            flex: 1;
          }
          .product-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 0.25rem;
          }
          .product-meta {
            color: #666;
            font-size: 0.9rem;
          }
          .product-price {
            font-weight: 600;
            color: #0068a5;
            font-size: 1.1rem;
          }
          .address-card {
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 8px;
            height: 100%;
          }
          .address-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 1rem;
            font-size: 1.1rem;
          }
          .address-line {
            color: #666;
            margin-bottom: 0.5rem;
          }
          .summary-table {
            width: 100%;
          }
          .summary-table td {
            padding: 0.75rem 0;
          }
          .summary-table .label {
            color: #666;
          }
          .summary-table .value {
            text-align: right;
            font-weight: 600;
          }
          .summary-table .total-row td {
            border-top: 2px solid #0068a5;
            padding-top: 1rem;
            font-size: 1.2rem;
            color: #0068a5;
          }
          .success-icon {
            font-size: 3rem;
            color: #28a745;
            margin-bottom: 1rem;
          }
          .order-number {
            font-size: 1.2rem;
            background: rgba(255,255,255,0.2);
            padding: 0.5rem 1rem;
            border-radius: 5px;
            display: inline-block;
            margin-top: 1rem;
            color: #0068a5;
          }
          .status-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85rem;
          }
          .status-confirmed {
            background: #d4edda;
            color: #155724;
          }
        `}</style>

        {/* Header Section */}
        <div className="thank-you-header">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1 className="mb-3">Thank You for Your Order!</h1>
          <p className="mb-0">Your order has been successfully placed and is being processed.</p>
          <div className="order-number">
            Order ID: <strong>{orderId}</strong>
          </div>
          <div className="mt-3">
            <span className="status-badge status-confirmed">
              {orderDetails.status || 'Confirmed'}
            </span>
          </div>
        </div>

        {/* Order Items Section */}
       {/* Order Items Section */}
<div className="order-section">
  <h6 className="section-title">Order Items</h6>
  <div className="table-responsive">
    <table className=" table basic-border-table table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>GST (18%)</th>
          <th className="text-end">Total</th>
        </tr>
      </thead>
      <tbody>
        {orderDetails.items?.map((item, index) => {
          // Print entire item data
          console.log("\n" + "=".repeat(60));
          console.log(`📦 Item ${index + 1} Data:`);
          console.log("=".repeat(60));
          console.log("Complete Item Object:", JSON.stringify(item, null, 2));
          console.log("Item keys:", Object.keys(item));
          console.log("Part object:", item.part);
          console.log("=".repeat(60) + "\n");
          
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity) || 0;
          const subtotal = price * quantity;
          const gst = subtotal * 0.18;
          const itemTotal = subtotal + gst;
          
          return (
            <tr key={index}>
              <td>
                <div className="d-flex align-items-center">
                  {/* <img 
                    src={item.part_image || item.part?.image || "/placeholder.jpg"} 
                    alt={item.part_name || item.part?.part_name || "Product"} 
                    className="product-image me-3"
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                    onError={(e) => {
                      console.error("Image failed to load:", e.target.src);
                      e.target.src = "/placeholder.jpg";
                    }}
                  /> */}
                  <div>
                    <div className="fw-bold">
                      {item.part_name || item.part?.product_name || "N/A"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="align-middle">₹{price.toFixed(2)}</td>
              <td className="align-middle">{quantity}</td>
              <td className="align-middle">₹{gst.toFixed(2)}</td>
              <td className="align-middle text-end fw-bold text-primary">₹{itemTotal.toFixed(2)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>

        {/* Addresses Section */}
        <div className="order-section">
          <h6 className="section-title">Delivery Information</h6>
          <div className="row">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="address-card">
                <div className="address-title">
                  <i className="fas fa-file-invoice me-2"></i>
                  Billing Address
                </div>
                <div className="address-line"><strong>{orderDetails.user?.first_name} {orderDetails.user?.last_name}</strong></div>
                <div className="address-line">{orderDetails.user?.email}</div>
                <div className="address-line">{orderDetails.user?.phone}</div>
                <div className="address-line">{orderDetails.user?.address}</div>
                <div className="address-line">
                  {orderDetails.user?.city}, {orderDetails.user?.district}
                </div>
                <div className="address-line">
                  {orderDetails.user?.state} - {orderDetails.user?.pincode}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="address-card">
                <div className="address-title">
                  <i className="fas fa-shipping-fast me-2"></i>
                  Shipping Address
                </div>
                {orderDetails.shipping_address ? (
                  <>
                    <div className="address-line"><strong>{orderDetails.shipping_address.name}</strong></div>
                    <div className="address-line">{orderDetails.shipping_address.email}</div>
                    <div className="address-line">{orderDetails.shipping_address.phone}</div>
                    <div className="address-line">{orderDetails.shipping_address.address}</div>
                    <div className="address-line">
                      {orderDetails.shipping_address.city}, {orderDetails.shipping_address.district}
                    </div>
                    <div className="address-line">
                      {orderDetails.shipping_address.state} - {orderDetails.shipping_address.zip}
                    </div>
                  </>
                ) : (
                  <div className="address-line">Same as billing address</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="order-section">
          <h6 className="section-title">Order Summary</h6>
          <table className="table basic-border-table summary-table">
            <tbody>
              <tr>
                <td className="label">Subtotal:</td>
                <td className="value">₹{subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="label">CGST (9%):</td>
                <td className="value">₹{cgst.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="label">SGST (9%):</td>
                <td className="value">₹{sgst.toFixed(2)}</td>
              </tr>
              <tr className="total-row">
                <td className="label">Total Amount:</td>
                <td className="value">₹{total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div className="mt-3 p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
            <small className="text-muted">
              <strong>Payment Details:</strong><br/>
              Payment ID: {orderDetails.razorpay_payment_id}<br/>
              {/* Order Date: {new Date(orderDetails.created_time).toLocaleDateString()} */}
            </small>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-4">
          <Link to="/orders" className="btn btn-primary btn-lg me-3">
            <i className="fas fa-list me-2"></i>
            View All Orders
          </Link>
          <Link to="/" className="btn btn-outline-primary btn-lg">
            <i className="fas fa-home me-2"></i>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Thankyou;