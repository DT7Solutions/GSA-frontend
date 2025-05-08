import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../../config";


const Partsection = ({id, Modelveriant}) => {

    const [partList, setpartList] = useState([]);

    useEffect(() => {
            const fetchCarModel = async () => {
              try {
                const response = await axios.get(`${API_BASE_URL}api/home/part_groups_list/${id}/`);
                debugger;
                setpartList(response.data);
                console.log('got car-models payload:', response.data);
              } catch (error) {
                console.error('Error fetching car makes:', error);
              }
            };
           
            fetchCarModel();
          }, []);



    return (
        <div className="category-area-1 pb-100 brand-logo-display mt-5">
            <div className="container-fluid">
                <h4 className="text-center fw-extrabold mb-20">filter By selected variant Part</h4>
                <div className="row mt-5 brands-sec">

                    {partList.map((item) => (
                        <div className="col-sm-12 col-md-2 col-lg-2 mb-3">
                            <div className="brand-models">
                                <Link to={`/part-list/${item.id}`}><img
                                    src={item.image}
                                    alt={item.name}
                                /></Link>
                                <div className="text-center">
                                    <Link  to={`/part-list/${item.id}`} className="text-center brand-name">
                                        {item.name}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Partsection;
