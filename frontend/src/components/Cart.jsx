import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import Swal from "sweetalert2";


const Cart = () => {

  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE_URL}api/home/cart/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(res.data.items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
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
        title: "Cart updated ",
        text: "Cart updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity, total_price: newQuantity * item.part.sale_price } : item
        )
      );
      navigate("/cart");
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };


  
  const handleRemoveItem = async (itemId) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`${API_BASE_URL}api/home/cart/remove/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      Swal.fire({
        title: "Item Removed",
        text: "Your product has been removed from the cart.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/cart");
    } catch (error) {
      console.error('Error removing item from cart:', error);
      Swal.fire({
        title: "Error",
        text: "There was an issue removing the item from the cart.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.total_price, 0);


  // handle checkout functionality
  const handleCheckout = async () => {
    const token = localStorage.getItem("accessToken");

    try {

      const { data } = await axios.post(
        `${API_BASE_URL}api/home/payment/order/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: data.razorpay_key,
        amount: data.amount,
        currency: data.currency,
        name: "Car Parts Store",
        description: "Car Parts Purchase",
        order_id: data.order_id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${API_BASE_URL}api/home/payment/verify/`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            Swal.fire("Order Placed!", "Your payment was successful.", "success");
            navigate(`/thank-you?order_id=${verifyRes.data.order_id}`);
          } catch (verifyError) {
            console.error("Payment verification failed", verifyError);
            Swal.fire("Payment Failed", "Could not verify payment.", "error");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating Razorpay order", error);
      Swal.fire("Error", "Failed to initiate payment.", "error");
    }
  };





  return (
    <div className="space-top space-extra-bottom">
      <div className="container">
        <form action="#" className="woocommerce-cart-form">
          <table className="cart_table">
            <thead>
              <tr>
                <th className="cart-col-image">Image</th>
                <th className="cart-col-productname">Product Name</th>
                <th className="cart-col-price">Price</th>
                <th className="cart-col-quantity">Quantity</th>
                <th className="cart-col-total">Total</th>
                <th className="cart-col-remove">Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr className="cart_item" key={item.id}>
                  <td data-title="Product">
                    <Link className="cart-productimage" to="/shop-details">
                      <img
                        width={91}
                        height={91}
                        src={item.part.part_group_image}
                        alt={item.part.part_group_name}
                      />
                    </Link>
                  </td>
                  <td data-title="Name">
                    <Link className="cart-productname" to="/shop-details">
                      {item.part.part_group_name}-{item.part.part_no}
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
                    <button onClick={() => handleRemoveItem(item.id)} className="remove">
                      <i className="fas fa-trash-alt" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>

        <div className="row justify-content-end">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <h2 className="h4 summary-title">Cart Totals</h2>
            <table className="cart_totals">
              <tbody>
                <tr>
                  <td>Cart Subtotal</td>
                  <td data-title="Cart Subtotal">
                    <span className="amount">
                      <bdi>₹{subtotal}</bdi>
                    </span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="order-total">
                  <td>Order Total</td>
                  <td data-title="Total">
                    <strong>
                      <span className="amount">
                        <bdi className="tot-amount">₹{subtotal}</bdi>
                      </span>
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="wc-proceed-to-checkout mb-30">
              <button onClick={handleCheckout} className="btn style2 btn-fw">
                Proceed to checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
