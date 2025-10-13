import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";
import Swal from "sweetalert2";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";



const Cart = () => {

  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { fetchCartCount } = useContext(CartContext);
 const [isConfirmed, setIsConfirmed] = useState(false);
const [isAddressUpdated, setIsAddressUpdated] = useState(false);



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

    const fetchUserProfile = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`${API_BASE_URL}api/auth/user/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { first_name, last_name, email, phone, state, city, district, address, pincode } = res.data;

      setShipping((prev) => ({
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
      fetchCartCount();
      navigate("/cart");
      
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };


  
  const handleRemoveItem = async (itemId, e) => {
     e.preventDefault(); 
    const token = localStorage.getItem('accessToken');
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
const cgst = subtotal * 0.09;
const sgst = subtotal * 0.09;
const totalWithGST = subtotal + cgst + sgst;
  
const handleUpdateAddress = async () => {
  const { email, phone, address, city, state, district, zip } = shipping;

  // Validation
  if (!email || !phone || !address || !city || !state || !district || !zip) {
    Swal.fire("Missing Fields", "Please fill out all shipping address fields.", "warning");
    return;
  }

  const token = localStorage.getItem("accessToken");
  const [first_name, ...rest] = shipping.name.split(" ");
  const last_name = rest.join(" ");

  try {
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

    Swal.fire("Success", "Shipping address updated in your profile.", "success");
    setIsAddressUpdated(true); // ✅ Enable Proceed to Checkout
  } catch (error) {
    console.error("Error updating address:", error);
    Swal.fire("Error", "Failed to update address in profile.", "error");
  }
};




 const handleCheckout = async () => {
  if (!isAddressUpdated) {
    Swal.fire({
      title: "Update Required",
      text: "Please update your shipping address by clicking the Update Address button.",
      icon: "info",
      confirmButtonText: "OK",
    });
    return;
  }

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
      amount: totalWithGST,
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
        name: shipping.name,
        email: shipping.email,
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



const handleShippingChange = (field, value) => {
  setShipping((prev) => ({
    ...prev,
    [field]: value,
  }));
  setIsConfirmed(false);         // ✅ Uncheck the checkbox
  setIsAddressUpdated(false);    // ✅ Require re-update of address
};




  return (
    <div className="space-top space-extra-bottom">
      <div className=" container">
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
                        src={item.part.product_image}
                        alt={item.part.product_name}
                      />
                    </Link>
                  </td>
                  <td data-title="Name">
                    <Link className="cart-productname" to="/shop-details">
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
                    {/* <button onClick={() => handleRemoveItem(item.id)} className="remove">
                      <i className="fas fa-trash-alt" />
                    </button> */}
                    <button
  onClick={(e) => handleRemoveItem(item.id, e)}
  className="remove"
  type="button" // <- Add this!
>
  <i className="fas fa-trash-alt" />
</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>

        <div className="row cart-page justify-content-end">
         <div className="col-md-6   ">
          <div className="shipping-area p-3">
    <h2 className="h4 summary-title">Shipping Address</h2>
    <form >
      <div className="form-group mb-3">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          value={shipping.email}
          onChange={(e) => handleShippingChange('email', e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label>Phone Number</label>
        <input
          type="tel"
          className="form-control"
          value={shipping.phone}
          onChange={(e) => handleShippingChange('phone', e.target.value)}
          required
        />
      </div>
        <div className="form-group mb-3">
        <label> D.no - Area address</label>
        <input
          type="text"
          className="form-control"
          value={shipping.address}
          onChange={(e) => handleShippingChange('address', e.target.value)}
          required
        />
      </div>
          <div className="form-group mb-3">
        <label>City</label>
        <input
          type="text"
          className="form-control"
          value={shipping.city}
          onChange={(e) => handleShippingChange('city', e.target.value)}
          required
        />
      </div>
           <div className="form-group mb-3">
        <label>District</label>
        <input
          type="text"
          className="form-control"
          value={shipping.district}
          onChange={(e) => handleShippingChange('district', e.target.value)}
          required
        />
      </div>
       <div className="form-group mb-3">
        <label>State</label>
        <input
          type="text"
          className="form-control"
          value={shipping.state}
          onChange={(e) => handleShippingChange('state', e.target.value)}
          required
        />
      </div>
    
  
     
      <div className="form-group mb-3">
        <label>Zip Code</label>
        <input
          type="text"
          className="form-control"
          value={shipping.zip}
          onChange={(e) => handleShippingChange('zip', e.target.value)}
          required
        />
      </div>
      <div className="form-check my-2">
      <input
        type="checkbox"
        className="form-check-input"
        id="confirmAddress"
        checked={isConfirmed}
        onChange={(e) => setIsConfirmed(e.target.checked)}
      />
      <label className="form-check-label" htmlFor="confirmAddress">
        I confirm that the above address is correct and products will be shipped here.
      </label>
    </div>

    <button
      onClick={(e) => {
        e.preventDefault();
        handleUpdateAddress();
      }}
      className="btn btn-secondary mt-2"
      disabled={!isConfirmed} // ✅ Disable unless checkbox is checked
    >
      Update Address
    </button>

    </form>
  </div>
  </div>

  {/* Cart Totals */}
  <div className="col-md-6  ">
    <div className="bg-white border-add p-3">
    <h2 className="h4 summary-title  p-3 mb-0 ">Cart Totals</h2>
    <table className="cart_totals ">
      <tbody>
        <tr>
          <td>Subtotal</td>
          <td><bdi>₹{subtotal.toFixed(2)}</bdi></td>
        </tr>
        <tr>
          <td>CGST (9%)</td>
          <td><bdi>₹{cgst.toFixed(2)}</bdi></td>
        </tr>
        <tr>
          <td>SGST (9%)</td>
          <td><bdi>₹{sgst.toFixed(2)}</bdi></td>
        </tr>
      </tbody>
      <tfoot>
        <tr className="order-total">
          <td>Order Total</td>
          <td><strong><bdi className="tot-amount">₹{totalWithGST.toFixed(2)}</bdi></strong></td>
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
    </div>
  );
};

export default Cart;
