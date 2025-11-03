// src/pages/EnquiryList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../../config";
import Swal from "sweetalert2";

const EnquiryList = () => {
  const [enquiries, setEnquiries] = useState([]);

 useEffect(() => {
  const fetchEnquiries = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}api/home/get_enquiries/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEnquiries(response.data);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      Swal.fire("Error", "Failed to fetch enquiries.", "error");
    }
  };
  fetchEnquiries();
}, []);


  return (
    <div className="card basic-data-table">
   
      <div className="card-header">
                <h5 className="card-title mb-0">Customer Enquiries</h5>
            </div>

      <div className="card">
        <div className="card-body table-responsive">
          <table className="table table-bordered table-striped">
            <thead className=" bg-theme-table">
              <tr>
                <th className="bg-theme-color">Name</th>
                <th className="bg-theme-color">Phone</th>
                <th className="bg-theme-color">Car Brand</th>
                <th className="bg-theme-color">Car Model</th>
                <th className="bg-theme-color">Model Year</th>
                <th className="bg-theme-color">Chassis Number</th>
                <th className="bg-theme-color">Message</th>
                <th className="bg-theme-color">Date</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length > 0 ? (
                enquiries.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.carBrand}</td>
                    <td>{item.carModel}</td>
                    <td>{item.modelYear}</td>
                    <td>{item.chassisNumber || "—"}</td>
                    <td>{item.message || "—"}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnquiryList;
