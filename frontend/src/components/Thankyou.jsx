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

  // Calculate totals - GST is already included in prices
  const subtotal = orderDetails.items?.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return acc + (price * quantity);
  }, 0) || 0;
  
  // Total to pay is the subtotal (GST already included)
  const total = parseFloat(orderDetails.total_price) || subtotal;
  
  // Calculate GST breakdown from included price (for display only)
  const basePrice = total / 1.18;
  const cgst = basePrice * 0.09;
  const sgst = basePrice * 0.09;

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
          .tax-breakdown-box {
            background: #f8f9fa;
            border-left: 4px solid #0068a5;
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 4px;
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
        <div className="order-section">
          <h6 className="section-title">Order Items</h6>
          <div className="table-responsive">
            <table className="table basic-border-table table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price (incl. GST)</th>
                  <th>Quantity</th>
                  <th className="text-end">Total (incl. GST)</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.items?.map((item, index) => {
                  console.log("\n" + "=".repeat(60));
                  console.log(`📦 Item ${index + 1} Data:`);
                  console.log("=".repeat(60));
                  console.log("Complete Item Object:", JSON.stringify(item, null, 2));
                  console.log("Item keys:", Object.keys(item));
                  console.log("Part object:", item.part);
                  console.log("=".repeat(60) + "\n");
                  
                  const price = parseFloat(item.price) || 0;
                  const quantity = parseInt(item.quantity) || 0;
                  const itemTotal = price * quantity;
                  
                  return (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div>
                            <div className="fw-bold">
                              {item.part_name || item.part?.product_name || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">₹{price.toFixed(2)}</td>
                      <td className="align-middle">{quantity}</td>
                      <td className="align-middle text-end fw-bold text-primary">₹{itemTotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="text-muted small mt-2">
            * All prices include GST (18% - CGST 9% + SGST 9%)
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
                <td className="label">Subtotal (incl. all taxes):</td>
                <td className="value">₹{total.toFixed(2)}</td>
              </tr>
              <tr className="total-row">
                <td className="label">Total Amount Paid:</td>
                <td className="value">₹{total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div className="tax-breakdown-box">
            <small>
              <strong>Tax Breakdown (Included in prices):</strong><br/>
              <div className="mt-2" style={{ marginLeft: '10px' }}>
                <div>Base Price: ₹{basePrice.toFixed(2)}</div>
                <div>CGST (9%): ₹{cgst.toFixed(2)}</div>
                <div>SGST (9%): ₹{sgst.toFixed(2)}</div>
                {/* <div className="mt-1 pt-1" style={{ borderTop: '1px solid #dee2e6' }}>
                  <strong>Total with GST: ₹{total.toFixed(2)}</strong>
                </div> */}
              </div>
            </small>
          </div>
          
          <div className="mt-3 p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
            <small className="text-muted">
              <strong>Payment Details:</strong><br/>
              Payment ID: {orderDetails.razorpay_payment_id}<br/>
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