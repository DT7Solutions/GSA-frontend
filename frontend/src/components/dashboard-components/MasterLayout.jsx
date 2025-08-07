import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import ThemeToggleButton from "../../helper/ThemeToggleButton";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_BASE_URL from "../../config";

const MasterLayout = ({ children }) => {
    let [sidebarActive, seSidebarActive] = useState(false);
    let [mobileMenu, setMobileMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");



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
                    submenu.style.maxHeight = "0px"; // Collapse submenu
                }
            });

            // Toggle the clicked dropdown
            if (!isActive) {
                clickedDropdown.classList.add("open");
                const submenu = clickedDropdown.querySelector(".sidebar-submenu");
                if (submenu) {
                    submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
                }
            }
        };

        // Attach click event listeners to all dropdown triggers
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
                            submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
                        }
                    }
                });
            });
        };

        // Open the submenu that contains the active route
        openActiveDropdown();

        // Cleanup event listeners on unmount
        return () => {
            dropdownTriggers.forEach((trigger) => {
                trigger.removeEventListener("click", handleDropdownClick);
            });
        };
    }, [location.pathname]);

    let sidebarControl = () => {
        seSidebarActive(!sidebarActive);
    };

    let mobileMenuControl = () => {
        setMobileMenu(!mobileMenu);
    };




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
                            userRole = "Dealer";
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


    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
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
                            src={`${process.env.PUBLIC_URL}/assets/img/gowri-shankar-logo.png`}
                            alt='site logo'
                            className='light-logo'
                        />
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/img/gowri-shankar-logo.png`}
                            alt='site logo'
                            className='dark-logo'
                        />
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/img/gowri-shankar-logo.png`}
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
                                {/* <li>
                                    <NavLink
                                        to='/Add-products'
                                        className={(navData) =>
                                            navData.isActive ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                        Add Product
                                    </NavLink>
                                </li> */}
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
                                {/* <li>
                                    <NavLink
                                        to='/car-group-part'
                                        className={(navData) =>
                                            navData.isActive ? "active-page" : ""
                                        }
                                    >
                                        <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                                      Part Group
                                    </NavLink>
                                </li> */}



                            </ul>
                        </li>

                        {/* <li>
                            <NavLink
                                to='/email'
                                className={(navData) => (navData.isActive ? "active-page" : "")}
                            >
                                <Icon icon='mage:email' className='menu-icon' />
                                <span>User Login</span>
                            </NavLink>
                        </li> */}
                    </ul>
                </div>
            </aside>
            <main
                className={sidebarActive ? "dashboard-main active" : "dashboard-main"}>
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
                                <form className='navbar-search'>
                                    <input type='text' name='search' placeholder='Search' />
                                    <Icon icon='ion:search-outline' className='icon' />
                                </form>
                            </div>
                        </div>
                        <div className='col-auto'>
                            <div className='d-flex flex-wrap align-items-center gap-4'>
                                {/* ThemeToggleButton */}
                                <ThemeToggleButton />
                                <div className='dropdown'>
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
                                {/* Profile dropdown end */}
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
