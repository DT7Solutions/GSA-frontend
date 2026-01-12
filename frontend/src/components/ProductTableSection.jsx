import React, { useState } from "react";
import { Link } from "react-router-dom";



const ProductTableSection = ({ 
  currentProducts, 
  indexOfFirstProduct, 
  indexOfLastProduct, 
  filteredProducts,
  handleAddToCart 
}) => {
  return (
    <>
      {/* Product Count and Sort Options Bar */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 p-3 bg-light rounded">
        <div className="product-count">
          <p className="mb-0">
            Showing <strong>{indexOfFirstProduct + 1}</strong> to{" "}
            <strong>
              {Math.min(indexOfLastProduct, filteredProducts.length)}
            </strong>{" "}
            of <strong>{filteredProducts.length}</strong> products
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col" style={{ width: "5%" }}>#</th>
              <th scope="col" style={{ width: "35%" }}>Part Name</th>
              <th scope="col" style={{ width: "20%" }}>Part No.</th>
              <th scope="col" style={{ width: "12%" }}>Stock</th>
              <th scope="col" style={{ width: "15%" }}>Price</th>
              <th scope="col" style={{ width: "13%" }} className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr key={product.id}>
                <td className="text-center fw-semibold">
                  {indexOfFirstProduct + index + 1}
                </td>
                <td>
                  <Link 
                    to={`/shop-details/${product.id}`}
                    className="text-decoration-none text-dark fw-medium"
                  >
                    {product.product_name || "Unnamed Product"}
                  </Link>
                </td>
                <td>
                  <span className="text-muted">
                    {product.part_number || product.product_code || "N/A"}
                  </span>
                </td>
                <td>
                  <span 
                    className={`badge ${
                      product.stock > 10 
                        ? "bg-success" 
                        : product.stock > 0 
                        ? "bg-warning" 
                        : "bg-danger"
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                  </span>
                </td>
                <td>
                  <div className="d-flex flex-column">
                    <span className="text-muted text-decoration-line-through small">
                      ₹{product.price}
                    </span>
                    <span className="fw-bold text-primary fs-5">
                      ₹{product.sale_price}
                    </span>
                  </div>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock === 0}
                  >
                    <i className="fas fa-shopping-cart me-1" />
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductTableSection;