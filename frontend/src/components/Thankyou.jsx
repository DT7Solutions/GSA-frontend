import React from "react";
import { useLocation } from "react-router-dom";

const Thankyou = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = params.get("order_id");

  return (
    <div className="login-screen" style={{ height: "111vh" }}>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center py-4 shadow ">
          <h1 className="py-4">Thank you for ordering!</h1>
          <h4>Your order ID: <strong>{orderId}</strong></h4>
        </div>
      </div>
    </div>
  );
};

export default Thankyou;
