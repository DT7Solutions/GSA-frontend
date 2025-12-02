import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_BASE_URL from "../../config";
import notificationService from '../dashboard-components/NotificationService';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MasterLayout = ({ children }) => {
    let [sidebarActive, seSidebarActive] = useState(false);
    let [mobileMenu, setMobileMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [notificationCount, setNotificationCount] = useState(0);

    // Dropdown menu effect
    useEffect(() => {
        const handleDropdownClick = (event) => {
            event.preventDefault();
            const clickedLink = event.currentTarget;
            const clickedDropdown = clickedLink.closest(".dropdown");

            if (!clickedDropdown) return;

            const isActive = clickedDropdown.classList.contains("open");

            // Close all dropdowns
            const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
            allDropdowns.forEach((dropdown) => {
                dropdown.classList.remove("open");
                const submenu = dropdown.querySelector(".sidebar-submenu");
                if (submenu) {
                    submenu.style.maxHeight = "0px";
                }
            });

            // Toggle the clicked dropdown
            if (!isActive) {
                clickedDropdown.classList.add("open");
                const submenu = clickedDropdown.querySelector(".sidebar-submenu");
                if (submenu) {
                    submenu.style.maxHeight = `${submenu.scrollHeight}px`;
                }
            }
        };

        const dropdownTriggers = document.querySelectorAll(
            ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
        );

        dropdownTriggers.forEach((trigger) => {
            trigger.addEventListener("click", handleDropdownClick);
        });

        const openActiveDropdown = () => {
            const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
            allDropdowns.forEach((dropdown) => {
                const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
                submenuLinks.forEach((link) => {
                    if (
                        link.getAttribute("href") === location.pathname ||
                        link.getAttribute("to") === location.pathname
                    ) {
                        dropdown.classList.add("open");
                        const submenu = dropdown.querySelector(".sidebar-submenu");
                        if (submenu) {
                            submenu.style.maxHeight = `${submenu.scrollHeight}px`;
                        }
                    }
                });
            });
        };

        openActiveDropdown();

        return () => {
            dropdownTriggers.forEach((trigger) => {
                trigger.removeEventListener("click", handleDropdownClick);
            });
        };
    }, [location.pathname, userRole]);

    let sidebarControl = () => {
        seSidebarActive(!sidebarActive);
    };

    let mobileMenuControl = () => {
        setMobileMenu(!mobileMenu);
    };

    // Get user data
    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userId = decoded.user_id;
                axios
                    .get(`${API_BASE_URL}api/auth/user/get_user_data/${userId}/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((res) => {
                        const { username, role_id } = res.data;
                        setIsLoggedIn(true);
                        setUserName(username);

                        let userRole = "";
                        if (role_id == 1) {
                            userRole = "Admin";
                        } else if (role_id == 2) {
                            userRole = "Staff";
                        } else {
                            userRole = "Customer";
                        }

                        setUserRole(userRole);
                    });
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    // Notification polling effect
    useEffect(() => {
        // Only start polling if user is admin or staff
        if (userRole === "Admin" || userRole === "Staff") {
            console.log(`👤 ${userRole} logged in - starting notification service`);
            
            // Handle incoming notifications
            const handleNotification = (notifications) => {
                notifications.forEach(notification => {
                    // Play notification sound
                    const audio = new Audio('/notification-sound.mp3');
                    audio.play().catch(e => console.log('Audio play failed:', e));
                    
                    // Show toast notification
                    toast.success(
                        <div>
                            <strong>🛒 New Order!</strong>
                            <div style={{ fontSize: '0.9em', marginTop: '5px' }}>
                                Order #{notification.order_id} from {notification.customer_name}
                                <br />
                                Amount: ₹{notification.total_amount.toFixed(2)}
                            </div>
                        </div>,
                        {
                            position: "top-right",
                            autoClose: 8000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        }
                    );
                    
                    // Update notification count
                    setNotificationCount(prev => prev + 1);
                });
            };
            
            notificationService.addListener(handleNotification);
            notificationService.startPolling(10000); // Poll every 10 seconds
            
            return () => {
                notificationService.removeListener(handleNotification);
                notificationService.stopPolling();
            };
        }
    }, [userRole]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        notificationService.stopPolling();
        navigate("/login");
    };

    return (
        <section className={mobileMenu ? "overlay active" : "overlay "}>
            {/* sidebar */}
            <aside
                className={
                    sidebarActive
                        ? "sidebar active "
                        : mobileMenu
                            ? "sidebar sidebar-open"
                            : "sidebar"
                }
            >
                <button
                    onClick={mobileMenuControl}
                    type='button'
                    className='sidebar-close-btn'
                >
                    <Icon icon='radix-icons:cross-2' />
                </button>
                <div>
                    <Link to='/' className='sidebar-logo'>
                        <img
                            src={`${process.env.PUBLIC_URL}/adminAssets/images/gallery/logo-light.png`}
                            alt='site logo'
                            className='light-logo'
                        />
                        <img
                            src={`${process.env.PUBLIC_URL}/adminAssets/images/gallery/logo-light.png`}
                            alt='site logo'
                            className='dark-logo'
                        />
                        <img
                            src={`${process.env.PUBLIC_URL}/adminAssets/images/gallery/logo-light.png`}
                            alt='site logo'
                            className='logo-icon'
                        />
                    </Link>
                </div>
                <div className='sidebar-menu-area'>
                    <ul className='sidebar-menu' id='sidebar-menu'>

                        <li className='dropdown'>
                            <Link to='/Dashboard'>
                                <Icon
                                    icon='solar:home-smile-angle-outline'
                                    className='menu-icon'
                                />
                                <span>Dashboard</span>
                            </Link>
                            <ul className='sidebar-submenu'>
                                <li>
                                    <NavLink
                                        to='/Dashboard'
                                        className={(navData) =>
                                            navData.isActive ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                                        Reports
                                    </NavLink>
                                </li>
                            </ul>
                        </li>

                        <li className='dropdown'>
                            <Link to="/orders">
                                <Icon icon="mdi:clipboard-list-outline" className="menu-icon" />
                                <span>Orders</span>
                            </Link>
                            <ul className='sidebar-submenu'>
                                <li>
                                    <NavLink
                                        to='/OrderList'
                                        className={(navData) =>
                                            navData.isActive ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                        Orders List
                                    </NavLink>
                                </li>
                            </ul>
                        </li>

                        <li className='dropdown'>
                            <Link to='#'>
                                <Icon icon='hugeicons:invoice-03' className='menu-icon' />
                                <span>Products</span>
                            </Link>
                            <ul className='sidebar-submenu'>
                                <li>
                                    <NavLink
                                        to='/products-list'
                                        className={(navData) =>
                                            navData.isActive ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                        Product List
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to='/Add-products'
                                        className={(navData) =>
                                            navData.isActive ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                        Add Product
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to='/car-barnds'
                                        className={(navData) =>
                                            navData.isActive ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                        Car Brands
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to='/car-models'
                                        className={(navData) =>
                                            navData.isActive ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                        Car Models
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to='/car-variants'
                                        className={(navData) =>
                                            navData.isActive ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                        Car Variants
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to='/car-category'
                                        className={(navData) =>
                                            navData.isActive ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                        Part Categorys
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to='/car-group-part'
                                        className={(navData) =>
                                            navData.isActive ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                        Part Group
                                    </NavLink>
                                </li>
                            </ul>
                        </li>

                        {userRole === "Admin" && (
                            <li className='dropdown'>
                                <Link to='#'>
                                    <Icon icon='solar:users-group-rounded-outline' className='menu-icon' />
                                    <span>Users</span>
                                </Link>
                                <ul className='sidebar-submenu'>
                                    <li>
                                        <NavLink
                                            to='/customers-list'
                                            className={(navData) =>
                                                navData.isActive ? "active-page" : ""
                                            }
                                        >
                                            <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                            Customers
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to='/staff-list'
                                            className={(navData) =>
                                                navData.isActive ? "active-page" : ""
                                            }
                                        >
                                            <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                            Staff
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        )}
                        
                        <li className='dropdown'>
                            <Link to='#'>
                                <Icon icon='mdi:form-outline' className='menu-icon' />
                                <span>Enquirys</span>
                            </Link>
                            <ul className='sidebar-submenu'>
                                <li>
                                    <NavLink
                                        to='/enquiry-queries'
                                        className={(navData) =>
                                            navData.isActive ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                        Queries
                                    </NavLink>
                                </li>
                            </ul>
                        </li>

                    </ul>
                </div>
            </aside>
            
            <main className={sidebarActive ? "dashboard-main active" : "dashboard-main"}>
                <div className='navbar-header'>
                    <div className='row align-items-center justify-content-between'>
                        <div className='col-auto'>
                            <div className='d-flex flex-wrap align-items-center gap-4'>
                                <button
                                    type='button'
                                    className='sidebar-toggle'
                                    onClick={sidebarControl}
                                >
                                    {sidebarActive ? (
                                        <Icon
                                            icon='iconoir:arrow-right'
                                            className='icon text-2xl non-active'
                                        />
                                    ) : (
                                        <Icon
                                            icon='heroicons:bars-3-solid'
                                            className='icon text-2xl non-active '
                                        />
                                    )}
                                </button>
                                <button
                                    onClick={mobileMenuControl}
                                    type='button'
                                    className='sidebar-mobile-toggle'
                                >
                                    <Icon icon='heroicons:bars-3-solid' className='icon' />
                                </button>
                            </div>
                        </div>
                        
                        <div className='col-auto'>
                            <div className='d-flex flex-wrap align-items-center gap-3'>
                                {/* Notification Bell */}
                                {(userRole === "Admin" || userRole === "Staff") && (
                                    <div className='dropdown'>
                                        <button
                                            className='position-relative d-flex justify-content-center align-items-center rounded-circle'
                                            type='button'
                                            style={{ width: '40px', height: '40px', border: '1px solid #ddd' }}
                                            onClick={() => {
                                                setNotificationCount(0);
                                                navigate('/OrderList');
                                            }}
                                        >
                                            <Icon icon='mdi:bell-outline' className='text-xl' />
                                            {notificationCount > 0 && (
                                                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                                                    {notificationCount > 9 ? '9+' : notificationCount}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* User Profile Dropdown */}
                                <div className='dropdown'>
                                     {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={8000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
                                    <button
                                        className='d-flex justify-content-center align-items-center rounded-circle'
                                        type='button'
                                        data-bs-toggle='dropdown'
                                    >
                                        <img
                                            src={`${process.env.PUBLIC_URL}/assets/img/gowri-shankar-logo.png`}
                                            alt='image_user'
                                            className='w-40-px h-40-px object-fit-cover rounded-circle'
                                        />
                                    </button>
                                    <div className='dropdown-menu to-top dropdown-menu-sm dash-board-menu'>
                                        <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                                            <div>
                                                <h6 className='text-lg text-primary-light fw-semibold mb-2'>
                                                    {userName}
                                                </h6>
                                                <span className='text-secondary-light fw-medium text-sm'>
                                                    {userRole}
                                                </span>
                                            </div>
                                            <button type='button' className='hover-text-danger'>
                                                <Icon
                                                    icon='radix-icons:cross-1'
                                                    className='icon text-xl'
                                                />
                                            </button>
                                        </div>

                                        <ul className='to-top-list dash-board-li'>
                                            {userName ? (
                                                <>
                                                    <li>
                                                        <Link
                                                            className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                                                            to='/view-profile'
                                                        >
                                                            <Icon
                                                                icon='solar:user-linear'
                                                                className='icon text-xl'
                                                            />
                                                            My Profile
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3 w-100 text-start border-0 bg-transparent'
                                                            onClick={handleLogout}
                                                        >
                                                            <Icon icon='lucide:power' className='icon text-xl' />
                                                            Log Out
                                                        </button>
                                                    </li>
                                                </>
                                            ) : (
                                                <li>
                                                    <Link
                                                        className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                                                        to='/login'
                                                    >
                                                        <Icon
                                                            icon='solar:user-linear'
                                                            className='icon text-xl'
                                                        />
                                                        Login
                                                    </Link>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* dashboard-main-body */}
                <div className='dashboard-main-body'>{children}</div>

                {/* Footer section */}
                <footer className='d-footer'>
                    <div className='row align-items-center justify-content-between'>
                        <div className='col-auto'>
                            <p className='mb-0'>© 2025 Gowri sankar agencies. All Rights Reserved.</p>
                        </div>
                        <div className='col-auto'>
                            <p className='mb-0'>
                                Made by <span className='text-primary-600'>Dt7.Agency</span>
                            </p>
                        </div>
                    </div>
                </footer>
            </main>

           
        </section>
    );
};

export default MasterLayout;