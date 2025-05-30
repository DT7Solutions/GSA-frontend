import React from 'react';
import Swal from 'sweetalert2';

const AddCarModal = ({ show, onClose, carBrandData, setCarBrandData, handleAddCar, carMakes }) => {
  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Car</h5>
            <button type="button" className="btn-close" onClick={onClose}>
              X
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleAddCar} className="input-style">
              <div className="mb-3">
                <label className="form-label">Car Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={carBrandData.brandname}
                  onChange={(e) =>
                    setCarBrandData({ ...carBrandData, brandname: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Upload Car Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    setCarBrandData({ ...carBrandData, image: e.target.files[0] })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary style2">
                Save Car
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCarModal;