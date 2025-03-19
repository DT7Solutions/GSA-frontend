import React from "react";
import { Link } from "react-router-dom";

const Checkout = () => {
  return (
    <div className="space">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="shipping-area">
              <h3 className="page-title">Payment Details</h3>
              <form className="checkout-form">
                <div className="form-group">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault1"
                  >
                    <img
                      src="assets/img/update-img/payment-method/03.png"
                      alt="Fixturbo"
                    />
                  </label>
                </div>
                <div className="form-group mb-4">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    defaultChecked=""
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault2"
                  >
                    Credit Card
                  </label>
                </div>
                <ul className="footer-currency currency-area">
                  <li>
                    <Link to="#">
                      <img
                        src="assets/img/update-img/payment-method/01.png"
                        alt="Fixturbo"
                      />
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <img
                        src="assets/img/update-img/payment-method/02.png"
                        alt="Fixturbo"
                      />
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <img
                        src="assets/img/update-img/payment-method/04.png"
                        alt="Fixturbo"
                      />
                    </Link>
                  </li>
                  <li>
                    <Link to="#">
                      <img
                        src="assets/img/update-img/payment-method/05.png"
                        alt="Fixturbo"
                      />
                    </Link>
                  </li>
                </ul>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Full name</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input type="password" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-group" defaultValue={"January"}>
                      <label>Expire Date</label>
                      <select className="form-control">
                        <option value={"April"}>April</option>
                        <option value={"March"}>March</option>
                        <option value={"February"}> February</option>
                        <option value={"January"}>January</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-group">
                      <label>Year</label>
                      <select className="form-control" defaultValue={"2021"}>
                        <option value={"2023"}>2023</option>
                        <option value={"2022"}>2022</option>
                        <option value={"2020"}>2020</option>
                        <option value={"2021"}>2021</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-group">
                      <label>CCV</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault3"
                    defaultChecked=""
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault3"
                  >
                    Cash on Delivery
                  </label>
                </div>
                <button type="submit" className="btn style2">
                  Checkout
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
