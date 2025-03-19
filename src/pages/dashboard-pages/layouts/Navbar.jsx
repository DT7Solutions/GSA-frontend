import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    return (
        <nav className="navbar navbar-light bg-light px-3 d-flex justify-content-between dashboard-navbar">
          <h5>Dashboard</h5>
          <Dropdown
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
            show={showDropdown}
          >
            <Dropdown.Toggle
              id="dropdown-basic"
              className="user-profile-icon"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
              }}
            >
              <FaUserCircle size={25} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <OverlayTrigger
                  placement="left"
                  overlay={<Tooltip>View Profile</Tooltip>}
                >
                  <span>Profile</span>
                </OverlayTrigger>
              </Dropdown.Item>
              <Dropdown.Item>
                <OverlayTrigger
                  placement="left"
                  overlay={<Tooltip>Orders</Tooltip>}
                >
                  <span>Orders</span>
                </OverlayTrigger>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </nav>
      );
    };

export default Navbar;
