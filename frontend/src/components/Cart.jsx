import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import Swal from "sweetalert2";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fetchCartCount } = useContext(CartContext);
  const [isShippingSameAsBilling, setIsShippingSameAsBilling] = useState(false);

  const [billing, setBilling] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    district: "",
    zip: "",
  });

  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    district: "",
    zip: "",
  });

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}api/home/cart/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(res.data.items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`${API_BASE_URL}api/auth/user/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { first_name, last_name, email, phone, state, city, district, address, pincode } = res.data;

        setBilling((prev) => ({
          ...prev,
          name: `${first_name} ${last_name}`.trim(),
          email,
          phone,
          address,
          city,
          state,
          district,
          zip: pincode,
        }));
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchCartItems();
    fetchUserProfile();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await axios.put(
        `${API_BASE_URL}api/home/cart/update/${itemId}/`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        title: "Cart updated",
        text: "Cart updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity, total_price: newQuantity * item.part.sale_price } : item
        )
      );
      fetchCartCount();
      navigate("/cart");
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleRemoveItem = async (itemId, e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`${API_BASE_URL}api/home/cart/remove/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      fetchCartCount();
      Swal.fire({
        title: "Item Removed",
        text: "Your product has been removed from the cart.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      Swal.fire({
        title: "Error",
        text: "There was an issue removing the item from the cart.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Calculate totals - Customer pays WITHOUT GST
  const subtotal = cartItems.reduce((acc, item) => acc + item.total_price, 0);
  
  // GST is already included in product prices, so we don't add it separately
  const totalToPay = subtotal;
  
  // Calculate the GST breakdown from the included price (for display purposes)
  // If price includes 18% GST, the base price is: price / 1.18
  const basePrice = subtotal / 1.18;
  const cgst = basePrice * 0.09;
  const sgst = basePrice * 0.09;

  const handleCheckout = async () => {
    const { name, email, phone, address, city, state, district, zip } = billing;

    if (!name || !email || !phone || !address || !city || !state || !district || !zip) {
      Swal.fire("Missing Fields", "Please fill out all billing address fields.", "warning");
      return;
    }

    const shippingData = isShippingSameAsBilling ? billing : shipping;
    const { name: shipName, email: shipEmail, phone: shipPhone, address: shipAddress, 
            city: shipCity, state: shipState, district: shipDistrict, zip: shipZip } = shippingData;

    if (!shipName || !shipEmail || !shipPhone || !shipAddress || !shipCity || !shipState || !shipDistrict || !shipZip) {
      Swal.fire("Missing Fields", "Please fill out all shipping address fields including name.", "warning");
      return;
    }

    const token = localStorage.getItem("accessToken");

    try {
      const [first_name, ...rest] = name.split(" ");
      const last_name = rest.join(" ");

      await axios.patch(
        `${API_BASE_URL}api/auth/user/profile/`,
        {
          first_name: first_name || "",
          last_name: last_name || "",
          email,
          phone,
          address,
          city,
          district,
          state,
          pincode: zip,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Billing address saved to profile");

      const shippingAddressPayload = {
        name: shippingData.name,
        email: shippingData.email,
        phone: shippingData.phone,
        address: shippingData.address,
        city: shippingData.city,
        state: shippingData.state,
        district: shippingData.district,
        zip: shippingData.zip,
      };

      console.log("\n" + "=".repeat(60));
      console.log("🚀 FRONTEND - Creating Razorpay Order");
      console.log("=".repeat(60));
      console.log("Shipping Address Payload:", JSON.stringify(shippingAddressPayload, null, 2));
      console.log("=".repeat(60) + "\n");

      const { data } = await axios.post(
        `${API_BASE_URL}api/home/payment/order/`,
        {
          shipping_address: shippingAddressPayload
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("\n" + "=".repeat(60));
      console.log("✅ FRONTEND - Razorpay Order Created");
      console.log("=".repeat(60));
      console.log("Order ID:", data.order_id);
      console.log("Amount:", data.amount);
      console.log("=".repeat(60) + "\n");

      const options = {
        key: data.razorpay_key,
        amount: data.amount,
        currency: data.currency,
        name: "Car Parts Store",
        description: "Car Parts Purchase",
        order_id: data.order_id,
        handler: async function (response) {
          console.log("\n" + "=".repeat(60));
          console.log("💳 FRONTEND - Payment Completed");
          console.log("=".repeat(60));
          console.log("Razorpay Order ID:", response.razorpay_order_id);
          console.log("Razorpay Payment ID:", response.razorpay_payment_id);
          console.log("Razorpay Signature:", response.razorpay_signature);
          console.log("=".repeat(60) + "\n");

          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shipping_address: shippingAddressPayload,
            };

            console.log("\n" + "=".repeat(60));
            console.log("🔍 FRONTEND - Verifying Payment");
            console.log("=".repeat(60));
            console.log("Verify Payload:", JSON.stringify(verifyPayload, null, 2));
            console.log("=".repeat(60) + "\n");

            await fetchCartCount();
            
            setCartItems([]);
            localStorage.removeItem("cartItems");

            const verifyRes = await axios.post(
              `${API_BASE_URL}api/home/payment/verify/`,
              verifyPayload,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log("\n" + "=".repeat(60));
            console.log("✅ FRONTEND - Payment Verified Successfully");
            console.log("=".repeat(60));
            console.log("Response:", verifyRes.data);
            console.log("=".repeat(60) + "\n");

            Swal.fire("Order Placed!", "Your payment was successful.", "success");
            navigate(`/thank-you?order_id=${verifyRes.data.order_id}`);
          } catch (verifyError) {
            console.error("\n" + "=".repeat(60));
            console.error("❌ FRONTEND - Payment Verification Failed");
            console.error("=".repeat(60));
            console.error("Error:", verifyError);
            console.error("Response:", verifyError.response?.data);
            console.error("=".repeat(60) + "\n");

            Swal.fire("Payment Failed", 
              verifyError.response?.data?.error || "Could not verify payment.", 
              "error");
          }
        },
        prefill: {
          name: billing.name,
          email: billing.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("\n" + "=".repeat(60));
      console.error("❌ FRONTEND - Checkout Error");
      console.error("=".repeat(60));
      console.error("Error:", error);
      console.error("Response:", error.response?.data);
      console.error("=".repeat(60) + "\n");

      Swal.fire("Error", 
        error.response?.data?.error || "Failed to process checkout.", 
        "error");
    }
  };

  const handleBillingChange = (field, value) => {
    setBilling((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleShippingChange = (field, value) => {
    setShipping((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSameAsBillingChange = (checked) => {
    setIsShippingSameAsBilling(checked);
    if (checked) {
      setShipping({
        name: billing.name,
        email: billing.email,
        phone: billing.phone,
        address: billing.address,
        city: billing.city,
        state: billing.state,
        district: billing.district,
        zip: billing.zip,
      });
    } else {
      setShipping({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        district: "",
        zip: "",
      });
    }
  };

  // Empty cart state
  if (loading) {
    return (
      <div className="space-top space-extra-bottom">
        <div className="container text-center py-5">
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="space-top space-extra-bottom">
        <div className="container">
          <div className="text-center py-5">
            <i className="fas fa-shopping-cart" style={{ fontSize: "80px", color: "#0068a5", marginBottom: "20px" }}></i>
            <h5 className="mb-3">Your Cart is Empty</h5>
            <p className="mb-5">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/shop/121" className="btn style2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-top space-extra-bottom">
      <div className="container">
        <form action="#" className="woocommerce-cart-form">
          <style>{`
            .cart_table thead th {
              background-color: #0068a5;
              color: white;
              text-align: center;
              vertical-align: middle;
              padding: 15px 10px;
            }
            .cart_table tbody td {
              text-align: center;
              vertical-align: middle;
              padding: 15px 10px;
            }
            .cart-productimage img {
              margin: 0 auto;
              display: block;
            }
            .quantity {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .gst-info {
              font-size: 0.85rem;
              color: #666;
              font-style: italic;
              margin-top: 5px;
            }
          `}</style>
          <table className="cart_table">
            <thead>
              <tr>
                {/* <th className="cart-col-image">Image</th> */}
                <th className="cart-col-productname">Product Name</th>
                <th className="cart-col-price">Price (incl. GST)</th>
                <th className="cart-col-quantity">Quantity</th>
                <th className="cart-col-total">Total (incl. GST)</th>
                <th className="cart-col-remove">Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr className="cart_item" key={item.id}>
                  {/* <td data-title="Product">
                    <Link className="cart-productimage" >
                      <img
                        width={91}
                        height={91}
                        src={item.part.product_image}
                        alt={item.part.product_name}
                      />
                    </Link>
                  </td> */}
                  <td data-title="Name">
                    <Link className="cart-productname">
                      {item.part.product_name}-{item.part.part_no}
                    </Link>
                  </td>
                  <td data-title="Price">
                    <span className="amount">
                      <bdi>₹{item.part.sale_price}</bdi>
                    </span>
                  </td>
                  <td data-title="Quantity">
                    <div className="quantity">
                      <button
                        className="quantity-minus qty-btn"
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        type="button"
                      >
                        <i className="fas fa-minus" />
                      </button>
                      <input
                        type="number"
                        className="qty-input"
                        value={item.quantity}
                        min={1}
                        max={item.part.stock_count}
                        readOnly
                      />
                      <button
                        className="quantity-plus qty-btn"
                        onClick={() => {
                          if (item.quantity < item.part.stock_count) {
                            updateQuantity(item.id, item.quantity + 1);
                          }
                        }}
                        type="button"
                      >
                        <i className="fas fa-plus" />
                      </button>
                    </div>
                  </td>
                  <td data-title="Total">
                    <span className="amount">
                      <bdi>₹{item.total_price}</bdi>
                    </span>
                  </td>
                  <td data-title="Remove">
                    <button
                      onClick={(e) => handleRemoveItem(item.id, e)}
                      className="remove"
                      type="button"
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="gst-info text-end mt-2">
            * All prices include GST (18% - CGST 9% + SGST 9%)
          </div>
        </form>

        <div className="row cart-page">
          {/* Billing Address */}
          <div className="col-md-6">
            <div className="shipping-area p-3 mb-4">
              <h2 className="h4 summary-title">Billing Address</h2>
              <form>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label>Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={billing.name}
                      onChange={(e) => handleBillingChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={billing.email}
                      onChange={(e) => handleBillingChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={billing.phone}
                      onChange={(e) => handleBillingChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label>D.no - Area address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={billing.address}
                      onChange={(e) => handleBillingChange("address", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={billing.city}
                      onChange={(e) => handleBillingChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>District</label>
                    <input
                      type="text"
                      className="form-control"
                      value={billing.district}
                      onChange={(e) => handleBillingChange("district", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={billing.state}
                      onChange={(e) => handleBillingChange("state", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={billing.zip}
                      onChange={(e) => handleBillingChange("zip", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="shipping-area p-3 mt-3 mb-4">
              <h2 className="h4 summary-title">Shipping Address</h2>
              <div className="form-check my-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="sameAsBilling"
                  checked={isShippingSameAsBilling}
                  onChange={(e) => handleSameAsBillingChange(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="sameAsBilling">
                  Same as Billing Address
                </label>
              </div>
              <form>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label>Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={isShippingSameAsBilling ? billing.name : shipping.name}
                      onChange={(e) => handleShippingChange("name", e.target.value)}
                      disabled={isShippingSameAsBilling}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={isShippingSameAsBilling ? billing.email : shipping.email}
                      onChange={(e) => handleShippingChange("email", e.target.value)}
                      disabled={isShippingSameAsBilling}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={isShippingSameAsBilling ? billing.phone : shipping.phone}
                      onChange={(e) => handleShippingChange("phone", e.target.value)}
                      disabled={isShippingSameAsBilling}
                      required
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label>Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={isShippingSameAsBilling ? billing.address : shipping.address}
                      onChange={(e) => handleShippingChange("address", e.target.value)}
                      disabled={isShippingSameAsBilling}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={isShippingSameAsBilling ? billing.city : shipping.city}
                      onChange={(e) => handleShippingChange("city", e.target.value)}
                      disabled={isShippingSameAsBilling}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>District</label>
                    <input
                      type="text"
                      className="form-control"
                      value={isShippingSameAsBilling ? billing.district : shipping.district}
                      onChange={(e) => handleShippingChange("district", e.target.value)}
                      disabled={isShippingSameAsBilling}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={isShippingSameAsBilling ? billing.state : shipping.state}
                      onChange={(e) => handleShippingChange("state", e.target.value)}
                      disabled={isShippingSameAsBilling}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={isShippingSameAsBilling ? billing.zip : shipping.zip}
                      onChange={(e) => handleShippingChange("zip", e.target.value)}
                      disabled={isShippingSameAsBilling}
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Cart Totals */}
          <div className="col-md-6">
            <div className="bg-white border-add p-3">
              <h2 className="h4 summary-title p-3 mb-0">Cart Totals</h2>
              <table className="cart_totals">
                <tbody>
                  <tr>
                    <td>Subtotal (incl. all taxes)</td>
                    <td>
                      <bdi>₹{subtotal.toFixed(2)}</bdi>
                    </td>
                  </tr>
                  <tr style={{ fontSize: '0.9rem', color: '#666' }}>
                    <td colSpan="2" style={{ padding: '10px', backgroundColor: '#f8f9fa' }}>
                      <strong>Tax Breakdown (Included in prices):</strong>
                      <div style={{ marginTop: '5px', marginLeft: '10px' }}>
                        <div>Base Price: ₹{basePrice.toFixed(2)}</div>
                        <div>CGST (9%): ₹{cgst.toFixed(2)}</div>
                        <div>SGST (9%): ₹{sgst.toFixed(2)}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="order-total">
                    <td>Total Amount to Pay</td>
                    <td>
                      <strong>
                        <bdi className="tot-amount">₹{totalToPay.toFixed(2)}</bdi>
                      </strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div className="text-muted small mt-2 px-3">
                * All taxes are included in the displayed prices
              </div>
              <div className="wc-proceed-to-checkout mb-30">
                <button onClick={handleCheckout} className="btn-theme-admin">
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;