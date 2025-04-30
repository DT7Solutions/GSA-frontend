import React from "react";
import { Link } from "react-router-dom";
import ProductListTable from "components/dashboard-components/product/ProductListTable"
import API_BASE_URL from "../../../config";

const PartListsection = ({id , partItem}) => {
    return (

        <div className="category-area-1 pb-100 brand-logo-display mt-5">
            <div className="container-fluid" >
                <h4 className="text-center fw-extrabold mb-20">Select Your Car Part</h4>
                <div className="row mt-5 brands-sec">

                    <div className="col-sm-12 col-md-4 col-lg-4 mb-3">
                        <div className="brand-models">
                            <Link to=""><img
                               src={`${API_BASE_URL}${partItem.image}`}
                                alt="Fixturbo"
                            /></Link>
                            <div className="text-center">
                                <Link to="" className="text-center brand-name">
                                {partItem.name}
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-8 col-lg-8 mb-3">
                        <div className="brand-models">
                           <ProductListTable itemids={id}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartListsection;
