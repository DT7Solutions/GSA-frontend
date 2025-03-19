import React from "react";
import { Link } from "react-router-dom";

const Cart = () => {
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
              <tr className="cart_item">
                <td data-title="Product">
                  <Link className="cart-productimage" to="/shop-details">
                    <img
                      width={91}
                      height={91}
                      src="assets/img/update-img/category/category1-1.png"
                      alt="Fixturbo"
                    />
                  </Link>
                </td>
                <td data-title="Name">
                  <Link className="cart-productname" to="/shop-details">
                    Car Engine Plug
                  </Link>
                </td>
                <td data-title="Price">
                  <span className="amount">
                    <bdi>
                      <span>$</span>18
                    </bdi>
                  </span>
                </td>
                <td data-title="Quantity">
                  <div className="quantity">
                    <button className="quantity-minus qty-btn">
                      <i className="fas fa-minus" />
                    </button>
                    <input
                      type="number"
                      className="qty-input"
                      defaultValue={1}
                      min={1}
                      max={99}
                    />
                    <button className="quantity-plus qty-btn">
                      <i className="fas fa-plus" />
                    </button>
                  </div>
                </td>
                <td data-title="Total">
                  <span className="amount">
                    <bdi>
                      <span>$</span>18
                    </bdi>
                  </span>
                </td>
                <td data-title="Remove">
                  <Link to="#" className="remove">
                    <i className="fas fa-trash-alt" />
                  </Link>
                </td>
              </tr>
              <tr className="cart_item">
                <td data-title="Product">
                  <Link className="cart-productimage" to="/shop-details">
                    <img
                      width={91}
                      height={91}
                      src="assets/img/update-img/category/category1-2.png"
                      alt="Fixturbo"
                    />
                  </Link>
                </td>
                <td data-title="Name">
                  <Link className="cart-productname" to="/shop-details">
                    Car Air Filter
                  </Link>
                </td>
                <td data-title="Price">
                  <span className="amount">
                    <bdi>
                      <span>$</span>18
                    </bdi>
                  </span>
                </td>
                <td data-title="Quantity">
                  <div className="quantity">
                    <button className="quantity-minus qty-btn">
                      <i className="fas fa-minus" />
                    </button>
                    <input
                      type="number"
                      className="qty-input"
                      defaultValue={1}
                      min={1}
                      max={99}
                    />
                    <button className="quantity-plus qty-btn">
                      <i className="fas fa-plus" />
                    </button>
                  </div>
                </td>
                <td data-title="Total">
                  <span className="amount">
                    <bdi>
                      <span>$</span>18
                    </bdi>
                  </span>
                </td>
                <td data-title="Remove">
                  <Link to="#" className="remove">
                    <i className="fas fa-trash-alt" />
                  </Link>
                </td>
              </tr>
              <tr className="cart_item">
                <td data-title="Product">
                  <Link className="cart-productimage" to="/shop-details">
                    <img
                      width={91}
                      height={91}
                      src="assets/img/update-img/category/category1-4.png"
                      alt="Fixturbo"
                    />
                  </Link>
                </td>
                <td data-title="Name">
                  <Link className="cart-productname" to="/shop-details">
                    CSK Red Wheel
                  </Link>
                </td>
                <td data-title="Price">
                  <span className="amount">
                    <bdi>
                      <span>$</span>18
                    </bdi>
                  </span>
                </td>
                <td data-title="Quantity">
                  <div className="quantity">
                    <button className="quantity-minus qty-btn">
                      <i className="fas fa-minus" />
                    </button>
                    <input
                      type="number"
                      className="qty-input"
                      defaultValue={1}
                      min={1}
                      max={99}
                    />
                    <button className="quantity-plus qty-btn">
                      <i className="fas fa-plus" />
                    </button>
                  </div>
                </td>
                <td data-title="Total">
                  <span className="amount">
                    <bdi>
                      <span>$</span>18
                    </bdi>
                  </span>
                </td>
                <td data-title="Remove">
                  <Link to="#" className="remove">
                    <i className="fas fa-trash-alt" />
                  </Link>
                </td>
              </tr>
              <tr>
                <td colSpan={6} className="actions">
                  <button type="submit" className="btn style2">
                    Update cart
                  </button>
                  <Link to="/shop" className="btn style-border3">
                    Continue Shopping
                  </Link>
                </td>
              </tr>
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
                      <bdi>
                        <span>$</span>47
                      </bdi>
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
                        <bdi>
                          <span>$</span>47
                        </bdi>
                      </span>
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="wc-proceed-to-checkout mb-30">
              <Link to="/checkout" className="btn style2 btn-fw">
                Proceed to checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
