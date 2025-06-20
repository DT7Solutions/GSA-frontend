import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_BASE_URL from "../config";

const HeaderFive = () => {
  const [active, setActive] = useState(false);
  const [scroll, setScroll] = useState(false);
  
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  const [cartCount, setCartCount] = useState(0);



  useEffect(() => {
    var offCanvasNav = document.getElementById("offcanvas-navigation");
    var offCanvasNavSubMenu = offCanvasNav.querySelectorAll(".sub-menu");

    for (let i = 0; i < offCanvasNavSubMenu.length; i++) {
      offCanvasNavSubMenu[i].insertAdjacentHTML(
        "beforebegin",
        "<span class='mean-expand-class'>+</span>"
      );
    }

    var menuExpand = offCanvasNav.querySelectorAll(".mean-expand-class");
    var numMenuExpand = menuExpand.length;

    function sideMenuExpand() {
      if (this.parentElement.classList.contains("active") === true) {
        this.parentElement.classList.remove("active");
      } else {
        for (let i = 0; i < numMenuExpand; i++) {
          menuExpand[i].parentElement.classList.remove("active");
        }
        this.parentElement.classList.add("active");
      }
    }

    for (let i = 0; i < numMenuExpand; i++) {
      menuExpand[i].addEventListener("click", sideMenuExpand);
    }
    window.onscroll = () => {
      if (window.pageYOffset < 150) {
        setScroll(false);
      } else if (window.pageYOffset > 150) {
        setScroll(true);
      }
      return () => (window.onscroll = null);
    };

  }, []);

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

          })
          .catch((err) => {
            console.error("Error fetching user data:", err);
            setIsLoggedIn(false);
            setUserName("Guest");
            setUserRole("User");
          });
  
      } catch (error) {
        console.error("Invalid token:", error);
        setIsLoggedIn(false);
        setUserName("Guest");
        setUserRole("User");
      }
    } else {
      setIsLoggedIn(false);
      setUserName("Guest");
      setUserRole("User");
    }

    
  }, []);


  const mobileMenu = () => {
    setActive(!active);
  };


  // cart value increment and decrement 
  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
  
      try {
        const res = await axios.get(`${API_BASE_URL}api/home/cart/count/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartCount(res.data.count);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };
  
    if (isLoggedIn) {

      fetchCartCount();
      
    }
  }, [isLoggedIn]);
  


  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    navigate("/login"); 
  };


  return (
    <header className="nav-header header-layout4 header-container" >
      <div className={`sticky-wrapper ${scroll && "sticky"} header-top`}>
        <div className="container ">
          <div className="row justify-content-center justify-content-md-between align-items-center gy-2">
            <div className="col-auto d-none d-lg-block">
              <div className="header-logo">
                <Link to="/">
                  <img src={`${process.env.PUBLIC_URL}/assets/img/gowri-shankar-logo.png`} alt="Fixturbo" className="main-logo" />
                </Link>
              </div>
            </div>
            <div className="col-auto d-none d-md-block">
              <div className="header-search-wrap">
                <form className="search-form">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Find your product"
                  />
                  <select
                    name="subject"
                    id="subject"
                    className="form-select"
                    defaultValue={"categories"}
                  >
                    <option value="categories">All categories</option>
                    <option value="Construction">Auto Repair</option>
                    <option value="Real Estate">Car Repair</option>
                    <option value="Industry">Automotive</option>
                  </select>
                  <button className="icon-btn" type="submit">
                    <i className="fas fa-search" />
                  </button>
                </form>
              </div>
            </div>
            <div className="col-auto">
              <div className="header-user-wrap">
                <ul>

                  <li>
                    <div className="header-grid-wrap">
                      <div className="simple-icon">

                      </div>
                      <div className="header-grid-details">

                        <h6 className="header-grid-title">
                          <div className='dropdown'>
                            <button
                              className='d-flex justify-content-center align-items-center rounded-circle'
                              type='button'
                              data-bs-toggle='dropdown'
                            >
                              <svg
                                width={23}
                                height={22}
                                viewBox="0 0 23 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.4642 0.48653C10.3922 0.48653 9.39616 0.758532 8.47616 1.30253C7.55616 1.84653 6.82416 2.57853 6.28016 3.49853C5.73616 4.41853 5.46416 5.41453 5.46416 6.48653C5.46416 7.55853 5.73616 8.55453 6.28016 9.47453C6.82416 10.3945 7.55616 11.1265 8.47616 11.6705C9.39616 12.2145 10.3922 12.4865 11.4642 12.4865C12.5362 12.4865 13.5322 12.2185 14.4522 11.6825C15.3722 11.1465 16.1042 10.4185 16.6482 9.49853C17.1922 8.57853 17.4642 7.57453 17.4642 6.48653C17.4642 5.39853 17.1962 4.39453 16.6602 3.47453C16.1242 2.55453 15.3962 1.82653 14.4762 1.29053C13.5562 0.754532 12.5522 0.48653 11.4642 0.48653ZM11.4642 10.4945C10.7442 10.4945 10.0762 10.3145 9.46016 9.95453C8.84416 9.59453 8.35616 9.10653 7.99616 8.49053C7.63616 7.87453 7.45616 7.20653 7.45616 6.48653C7.45616 5.76653 7.63616 5.10253 7.99616 4.49453C8.35616 3.88653 8.84416 3.40253 9.46016 3.04253C10.0762 2.68253 10.7442 2.50253 11.4642 2.50253C12.1842 2.50253 12.8522 2.68253 13.4682 3.04253C14.0842 3.40253 14.5722 3.88653 14.9322 4.49453C15.2922 5.10253 15.4722 5.76653 15.4722 6.48653C15.4722 7.20653 15.2922 7.87453 14.9322 8.49053C14.5722 9.10653 14.0842 9.59453 13.4682 9.95453C12.8522 10.3145 12.1842 10.4945 11.4642 10.4945ZM0.976156 21.5105C1.28016 21.6385 1.57616 21.7665 1.86416 21.8945L1.88816 21.8225C1.90416 21.7745 1.93216 21.7305 1.97216 21.6905C2.01216 21.6505 2.08816 21.5425 2.20016 21.3665L2.36816 21.1025C2.65616 20.5905 3.19216 19.9585 3.97616 19.2065C4.82416 18.4065 5.80816 17.7745 6.92816 17.3105C8.28816 16.7665 9.79216 16.4945 11.4402 16.4945C13.0882 16.4945 14.6082 16.7825 16.0002 17.3585C17.0882 17.8065 18.0802 18.4225 18.9762 19.2065C19.6482 19.7985 20.1762 20.4305 20.5602 21.1025C20.6402 21.1985 20.7202 21.3265 20.8002 21.4865C20.8802 21.5985 20.9282 21.6705 20.9442 21.7025C20.9602 21.7345 20.9842 21.7665 21.0162 21.7985C21.0482 21.8305 21.0642 21.8545 21.0642 21.8705C21.0642 21.8865 21.0642 21.8945 21.0642 21.8945L21.9762 21.5105L22.8642 21.1025V21.0065C22.8642 20.9745 22.8482 20.9425 22.8162 20.9105C22.7842 20.8785 22.7602 20.8385 22.7442 20.7905C22.7282 20.7425 22.6802 20.6625 22.6002 20.5505C22.4562 20.3425 22.3442 20.1585 22.2642 19.9985C21.7042 19.1665 21.0722 18.4305 20.3682 17.7905C19.2962 16.8465 18.1202 16.1025 16.8402 15.5585C15.1922 14.8545 13.4322 14.5025 11.5602 14.5025C9.62416 14.5025 7.86416 14.8385 6.28016 15.5105C4.96816 16.0545 3.80016 16.8145 2.77616 17.7905C2.05616 18.4305 1.41616 19.1665 0.856156 19.9985L0.688156 20.2625C0.528156 20.5185 0.424156 20.6945 0.376156 20.7905C0.328156 20.8385 0.296156 20.8865 0.280156 20.9345L0.256156 21.0065V21.1025C0.192156 21.1025 0.160156 21.1105 0.160156 21.1265C0.160156 21.1425 0.224156 21.1745 0.352156 21.2225L0.976156 21.5105Z"
                                  fill="#1B1F22"
                                />
                              </svg>
                            </button>

                            <div className="dropdown-menu to-top dropdown-menu-sm">
                              {isLoggedIn ? (
                                <>
                                  {/* User Info */}
                                  <div className="py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                                    <div>
                                      <h6 className="text-lg text-primary-light fw-semibold mb-2">
                                        {userName}
                                      </h6>
                                      <span className="text-secondary-light fw-medium text-sm">
                                      {userRole}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Authenticated User Menu */}
                                  <ul className="to-top-list">
                                    <li>
                                      <Link
                                        className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                                        to="/view-profile"
                                      >
                                        <Icon icon="solar:user-linear" className="icon text-xl" /> My Profile
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                                        to="/change-password"
                                      >
                                        <Icon icon="tabler:lock" className="icon text-xl" /> Change Password
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                                        to="/orders"
                                      >
                                   
                                        <Icon icon="mdi:package-variant-closed" className="icon text-xl" /> Myorders
                                      </Link>
                                    </li>
                                    <li>
                                      <button
                                        className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3 border-0 bg-transparent"
                                        onClick={handleLogout}
                                      >
                                        <Icon icon="lucide:power" className="icon text-xl" /> Log Out
                                      </button>
                                    </li>
                                  </ul>
                                </>
                              ) : (
                                // Show Login Option if User is NOT Logged In
                                <ul className="to-top-list">
                                  <li>
                                    <Link
                                      className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                                      to="/login"
                                    >
                                      <Icon icon="solar:user-linear" className="icon text-xl" /> Login
                                    </Link>
                                  </li>
                                </ul>
                              )}
                            </div>

                          </div>
                        </h6>
                      </div>
                    </div>
                  </li>


                  <li>
                    {/* <Link to="/wishlist" className="simple-icon">
                      <i className="far fa-heart" />
                      <span className="badge">1</span>
                    </Link> */}
                  </li>
                  <li>
                    {isLoggedIn ? (
<div className="header-grid-wrap">
                      <div className="simple-icon">
                        <Link to="/cart">
                          <svg
                            width={27} 
                            height={24}
                            viewBox="0 0 27 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M26.182 4.64365C25.6274 3.98499 24.9427 3.65565 24.128 3.65565H7.22803L6.13603 1.05565C6.08403 0.847654 5.96703 0.687321 5.78503 0.574654C5.60303 0.461987 5.39936 0.405655 5.17403 0.405655H1.92403C1.5947 0.405655 1.33036 0.505322 1.13103 0.704655C0.931698 0.903988 0.832031 1.16832 0.832031 1.49765C0.832031 1.82699 0.931698 2.08699 1.13103 2.27765C1.33036 2.46832 1.5947 2.56365 1.92403 2.56365H4.42003L5.92803 6.25566L9.93203 16.1097C10.14 16.647 10.4694 17.0543 10.92 17.3317C11.3707 17.609 11.8734 17.7477 12.428 17.7477H12.87L22.49 16.0057C22.9407 15.9017 23.3394 15.6937 23.686 15.3817C24.0327 15.0697 24.284 14.697 24.44 14.2637V14.1597L26.52 6.90565C26.676 6.52432 26.728 6.13432 26.676 5.73565C26.624 5.33699 26.4594 4.97299 26.182 4.64365ZM22.62 13.5097C22.5334 13.6657 22.4207 13.813 22.282 13.9517L12.636 15.6937C12.4627 15.6937 12.3457 15.6763 12.285 15.6417C12.2244 15.607 12.1594 15.5117 12.09 15.3557L8.19003 5.81365H24.128C24.336 5.81365 24.44 5.85699 24.44 5.94366C24.5267 6.01299 24.57 6.15166 24.57 6.35966L22.62 13.5097ZM9.72403 19.4637C9.1867 19.4637 8.71003 19.6717 8.29403 20.0877C7.87803 20.5037 7.67003 20.9847 7.67003 21.5307C7.67003 22.0767 7.87803 22.5577 8.29403 22.9737C8.71003 23.3897 9.1867 23.5977 9.72403 23.5977C10.0707 23.5977 10.4044 23.5023 10.725 23.3117C11.0457 23.121 11.3014 22.8653 11.492 22.5447C11.6827 22.224 11.778 21.886 11.778 21.5307C11.778 21.1753 11.6827 20.8373 11.492 20.5167C11.3014 20.196 11.0457 19.9403 10.725 19.7497C10.4044 19.559 10.0707 19.4637 9.72403 19.4637ZM22.074 19.4637C21.5367 19.4637 21.06 19.6717 20.644 20.0877C20.228 20.5037 20.02 20.9847 20.02 21.5307C20.02 22.0767 20.228 22.5577 20.644 22.9737C21.06 23.3897 21.5367 23.5977 22.074 23.5977C22.4207 23.5977 22.7544 23.5023 23.075 23.3117C23.3957 23.121 23.6514 22.8653 23.842 22.5447C24.0327 22.224 24.128 21.886 24.128 21.5307C24.128 21.1753 24.0327 20.8373 23.842 20.5167C23.6514 20.196 23.3957 19.9403 23.075 19.7497C22.7544 19.559 22.4207 19.4637 22.074 19.4637Z"
                              fill="#1B1F22"
                            />
                          </svg>
                           <span className="badge">{cartCount}</span> 
                        </Link>
                      </div>
                    </div>
                    ):(
                       <div className="header-grid-wrap">
                      <div className="simple-icon">
                        <Link to="/cart">
                          <svg
                            width={27} 
                            height={24}
                            viewBox="0 0 27 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M26.182 4.64365C25.6274 3.98499 24.9427 3.65565 24.128 3.65565H7.22803L6.13603 1.05565C6.08403 0.847654 5.96703 0.687321 5.78503 0.574654C5.60303 0.461987 5.39936 0.405655 5.17403 0.405655H1.92403C1.5947 0.405655 1.33036 0.505322 1.13103 0.704655C0.931698 0.903988 0.832031 1.16832 0.832031 1.49765C0.832031 1.82699 0.931698 2.08699 1.13103 2.27765C1.33036 2.46832 1.5947 2.56365 1.92403 2.56365H4.42003L5.92803 6.25566L9.93203 16.1097C10.14 16.647 10.4694 17.0543 10.92 17.3317C11.3707 17.609 11.8734 17.7477 12.428 17.7477H12.87L22.49 16.0057C22.9407 15.9017 23.3394 15.6937 23.686 15.3817C24.0327 15.0697 24.284 14.697 24.44 14.2637V14.1597L26.52 6.90565C26.676 6.52432 26.728 6.13432 26.676 5.73565C26.624 5.33699 26.4594 4.97299 26.182 4.64365ZM22.62 13.5097C22.5334 13.6657 22.4207 13.813 22.282 13.9517L12.636 15.6937C12.4627 15.6937 12.3457 15.6763 12.285 15.6417C12.2244 15.607 12.1594 15.5117 12.09 15.3557L8.19003 5.81365H24.128C24.336 5.81365 24.44 5.85699 24.44 5.94366C24.5267 6.01299 24.57 6.15166 24.57 6.35966L22.62 13.5097ZM9.72403 19.4637C9.1867 19.4637 8.71003 19.6717 8.29403 20.0877C7.87803 20.5037 7.67003 20.9847 7.67003 21.5307C7.67003 22.0767 7.87803 22.5577 8.29403 22.9737C8.71003 23.3897 9.1867 23.5977 9.72403 23.5977C10.0707 23.5977 10.4044 23.5023 10.725 23.3117C11.0457 23.121 11.3014 22.8653 11.492 22.5447C11.6827 22.224 11.778 21.886 11.778 21.5307C11.778 21.1753 11.6827 20.8373 11.492 20.5167C11.3014 20.196 11.0457 19.9403 10.725 19.7497C10.4044 19.559 10.0707 19.4637 9.72403 19.4637ZM22.074 19.4637C21.5367 19.4637 21.06 19.6717 20.644 20.0877C20.228 20.5037 20.02 20.9847 20.02 21.5307C20.02 22.0767 20.228 22.5577 20.644 22.9737C21.06 23.3897 21.5367 23.5977 22.074 23.5977C22.4207 23.5977 22.7544 23.5023 23.075 23.3117C23.3957 23.121 23.6514 22.8653 23.842 22.5447C24.0327 22.224 24.128 21.886 24.128 21.5307C24.128 21.1753 24.0327 20.8373 23.842 20.5167C23.6514 20.196 23.3957 19.9403 23.075 19.7497C22.7544 19.559 22.4207 19.4637 22.074 19.4637Z"
                              fill="#1B1F22"
                            />
                          </svg>
                           {/* <span className="badge">{cartCount}</span>  */}
                        </Link>
                      </div>
                    </div>
                    )}
                    
                  </li>


                  {/* <div className="header-grid-details ">
                        <button
                          type="button"
                          className="menu-toggle icon-btn"
                          onClick={mobileMenu}
                        >
                          <i className="fas fa-bars" />
                        </button>
                      </div> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`sticky-wrapper ${scroll && "sticky"}`}>
        {/* Main Menu Area */}
       
        {/* Mobile Menu */}
        <div className={`mobile-menu-wrapper  ${active && "body-visible"}`}>
          <div className="mobile-menu-area">
            <div className="mobile-logo">
              <Link to="/">
                <img src={`${process.env.PUBLIC_URL}/assets/img/gowri-shankar-logo.png`} alt="Fixturbo" />
              </Link>
              <button className="menu-toggle" onClick={mobileMenu}>
                <i className="fa fa-times" />
              </button>
            </div>
            <div className="mobile-menu">
              <ul id="offcanvas-navigation">
                <li className="menu-item-has-children submenu-item-has-children">
                  <Link to="/About">About</Link>
                  {/* <ul className="sub-menu submenu-class">
                    <li>
                      <NavLink
                        to="/"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Home 01
                      </NavLink>
                    </li>
                  </ul> */}
                </li>

                <li>
                  <NavLink
                    to="/contact"
                    className={(navData) => (navData.isActive ? "active" : "")}
                  >
                    Contact
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>




    </header>
  );
};

export default HeaderFive;
