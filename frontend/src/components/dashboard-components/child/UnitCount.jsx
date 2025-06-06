import React from 'react';
import { Icon } from '@iconify/react';

const UnitCount = ({ stats }) => {
  return (
    <div className="row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4">
      {/* Total Orders */}
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-1 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">Total Orders</p>
                <h6 className="mb-0">{stats.totalOrders}</h6>
              </div>
              <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                <Icon icon="mdi:cart" className="text-white text-2xl mb-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Income */}
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-2 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">Total Income</p>
                <h6 className="mb-0">₹{stats.totalIncome.toFixed(2)}</h6>
              </div>
              <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                <Icon icon="mdi:currency-inr" className="text-white text-2xl mb-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Orders */}
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-3 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">Completed Orders</p>
                <h6 className="mb-0">{stats.completedOrders}</h6>
              </div>
              <div className="w-50-px h-50-px bg-success rounded-circle d-flex justify-content-center align-items-center">
                <Icon icon="mdi:check-circle" className="text-white text-2xl mb-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-4 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">Pending Orders</p>
                <h6 className="mb-0">{stats.pendingOrders}</h6>
              </div>
              <div className="w-50-px h-50-px bg-warning rounded-circle d-flex justify-content-center align-items-center">
                <Icon icon="mdi:clock-outline" className="text-white text-2xl mb-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Failed Orders */}
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-5 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">Failed Orders</p>
                <h6 className="mb-0">{stats.failedOrders}</h6>
              </div>
              <div className="w-50-px h-50-px bg-danger rounded-circle d-flex justify-content-center align-items-center">
                <Icon icon="mdi:close-circle-outline" className="text-white text-2xl mb-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCount;
