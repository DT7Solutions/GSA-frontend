import React from "react";
import { Link } from "react-router-dom";

const Wishlist = () => {
  return (
    <div className="space-top space-extra-bottom ">
      <div className="container">
        <div className="tinv-wishlist woocommerce tinv-wishlist-clear">
          <form action="#" method="post" autoComplete="off">
            <table className="tinvwl-table-manage-list">
              <thead>
                <tr>
                  <th className="product-remove" />
                  <th className="product-thumbnail">&nbsp;</th>
                  <th className="product-name">
                    <span className="tinvwl-full">Product Name</span>
                    <span className="tinvwl-mobile">Product</span>
                  </th>
                  <th className="product-price">Unit Price</th>
                  <th className="product-stock">Stock Status</th>
                  <th className="product-action">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                <tr className="wishlist_item">
                  <td className="product-remove">
                    <button
                      type="submit"
                      name="tinvwl-remove"
                      value={58}
                      title="Remove"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </td>
                  <td className="product-thumbnail">
                    <Link to="/shop-details">
                      <img
                        src="assets/img/update-img/category/category1-1.png"
                        className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                        alt="Fixturbo"
                      />
                    </Link>
                  </td>
                  <td className="product-name">
                    <Link to="/shop-details">Car Air Filter</Link>
                  </td>
                  <td className="product-price">
                    <span className="woocommerce-Price-amount amount">
                      <bdi>
                        <span className="woocommerce-Price-currencySymbol">
                          $
                        </span>
                        45.00
                      </bdi>
                    </span>
                  </td>
                  <td className="product-stock">
                    <p className="stock in-stock">
                      <span>
                        <span className="tinvwl-txt">In stock</span>
                      </span>
                    </p>
                  </td>
                  <td className="product-action">
                    <button
                      className="button btn style2"
                      name="tinvwl-add-to-cart"
                      value={58}
                      title="Add to Cart"
                    >
                      <span className="tinvwl-txt">Add to Cart</span>
                    </button>
                  </td>
                </tr>
                <tr className="wishlist_item">
                  <td className="product-remove">
                    <button
                      type="submit"
                      name="tinvwl-remove"
                      value={60}
                      title="Remove"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </td>
                  <td className="product-thumbnail">
                    <Link to="/shop-details">
                      <img
                        src="assets/img/update-img/category/category1-2.png"
                        className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                        alt="Fixturbo"
                      />
                    </Link>
                  </td>
                  <td className="product-name">
                    <Link to="/shop-details">Engine pistons</Link>
                  </td>
                  <td className="product-price">
                    <ins>
                      <span className="woocommerce-Price-amount amount">
                        <bdi>
                          <span className="woocommerce-Price-currencySymbol">
                            $
                          </span>
                          18.00
                        </bdi>
                      </span>
                    </ins>
                    <del>
                      <span className="woocommerce-Price-amount amount">
                        <bdi>
                          <span className="woocommerce-Price-currencySymbol">
                            $
                          </span>
                          20.00
                        </bdi>
                      </span>
                    </del>
                  </td>
                  <td className="product-stock">
                    <p className="stock in-stock">
                      <span>
                        <span className="tinvwl-txt">In stock</span>
                      </span>
                    </p>
                  </td>
                  <td className="product-action">
                    <button
                      className="button btn style2"
                      name="tinvwl-add-to-cart"
                      value={60}
                      title="Add to Cart"
                    >
                      <span className="tinvwl-txt">Add to Cart</span>
                    </button>
                  </td>
                </tr>
                <tr className="wishlist_item">
                  <td className="product-remove">
                    <button
                      type="submit"
                      name="tinvwl-remove"
                      value={60}
                      title="Remove"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </td>
                  <td className="product-thumbnail">
                    <Link to="/shop-details">
                      <img
                        src="assets/img/update-img/category/category1-3.png"
                        className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                        alt="Fixturbo"
                      />
                    </Link>
                  </td>
                  <td className="product-name">
                    <Link to="/shop-details">Exhaust manifold</Link>
                  </td>
                  <td className="product-price">
                    <ins>
                      <span className="woocommerce-Price-amount amount">
                        <bdi>
                          <span className="woocommerce-Price-currencySymbol">
                            $
                          </span>
                          18.00
                        </bdi>
                      </span>
                    </ins>
                    <del>
                      <span className="woocommerce-Price-amount amount">
                        <bdi>
                          <span className="woocommerce-Price-currencySymbol">
                            $
                          </span>
                          20.00
                        </bdi>
                      </span>
                    </del>
                  </td>
                  <td className="product-stock">
                    <p className="stock in-stock">
                      <span>
                        <span className="tinvwl-txt">In stock</span>
                      </span>
                    </p>
                  </td>
                  <td className="product-action">
                    <button
                      className="button btn style2"
                      name="tinvwl-add-to-cart"
                      value={60}
                      title="Add to Cart"
                    >
                      <span className="tinvwl-txt">Add to Cart</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
