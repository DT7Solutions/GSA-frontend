import React from "react";
import { Link } from "react-router-dom";

const ProductCategories = () => {
  return (
    <div className="product-area-2 space-top1 overflow-hidden">
      <div className="container">
        <div className="mb-50">
          <div className="row gy-4 justify-content-lg-between justify-content-center align-items-center text-lg-start text-center">
            <div className="col-lg-6">
              <div className="title-area mb-0">
                <h3 className="sec-title mb-0">Categories Products</h3>
              </div>
            </div>
            <div className="col-auto">
              <div className="sec-btn">
                <Link to="/shop" className="btn style-border2">
                  See More
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row gy-30 gx-30 justify-content-center tr-products">
         
        </div>
      </div>
    </div>
  );
};

export default ProductCategories;
